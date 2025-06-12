import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { createClient } from '@supabase/supabase-js';

const prisma = new PrismaClient();
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

// GET - Fetch all active services with their variables
export async function GET() {
  try {
    const services = await prisma.service.findMany({
      where: {
        isActive: true
      },
      include: {
        variables: true
      },
      orderBy: {
        createdAt: 'desc'
      }
    });

    return NextResponse.json({ services });
  } catch (error) {
    console.error('Error fetching services:', error);
    return NextResponse.json(
      { error: 'Failed to fetch services' },
      { status: 500 }
    );
  }
}

// POST - Create a new service
export async function POST(request: NextRequest) {
  try {
    const authHeader = request.headers.get('authorization');
    if (!authHeader) {
      return NextResponse.json(
        { error: 'Authorization header required' },
        { status: 401 }
      );
    }

    const token = authHeader.replace('Bearer ', '');
    const { data: { user }, error: authError } = await supabase.auth.getUser(token);

    if (authError || !user) {
      return NextResponse.json(
        { error: 'Invalid or expired token' },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { name, description, icon, variables } = body;

    if (!name || !variables || variables.length === 0) {
      return NextResponse.json(
        { error: 'Service name and at least one variable are required' },
        { status: 400 }
      );
    }

    // Create service with variables in a transaction
    const service = await prisma.$transaction(async (tx) => {
      const newService = await tx.service.create({
        data: {
          name,
          description,
          icon
        }
      });

      // Create service variables
      for (const variable of variables) {
        await tx.serviceVariable.create({
          data: {
            name: variable.name,
            unitPrice: variable.unitPrice,
            serviceId: newService.id
          }
        });
      }

      return newService;
    });

    // Fetch the complete service with variables
    const completeService = await prisma.service.findUnique({
      where: { id: service.id },
      include: {
        variables: true
      }
    });

    return NextResponse.json({ service: completeService });
  } catch (error) {
    console.error('Error creating service:', error);
    return NextResponse.json(
      { error: 'Failed to create service' },
      { status: 500 }
    );
  }
}

// PUT - Update a service
export async function PUT(request: NextRequest) {
  try {
    const authHeader = request.headers.get('authorization');
    if (!authHeader) {
      return NextResponse.json(
        { error: 'Authorization header required' },
        { status: 401 }
      );
    }

    const token = authHeader.replace('Bearer ', '');
    const { data: { user }, error: authError } = await supabase.auth.getUser(token);

    if (authError || !user) {
      return NextResponse.json(
        { error: 'Invalid or expired token' },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { id, name, description, icon, variables } = body;

    if (!id || !name) {
      return NextResponse.json(
        { error: 'Service ID and name are required' },
        { status: 400 }
      );
    }

    // Update service with variables in a transaction
    const service = await prisma.$transaction(async (tx) => {
      // Update the service
      const updatedService = await tx.service.update({
        where: { id },
        data: {
          name,
          description,
          icon
        }
      });

      // Delete existing variables
      await tx.serviceVariable.deleteMany({
        where: { serviceId: id }
      });

      // Create new variables
      if (variables && variables.length > 0) {
        await tx.serviceVariable.createMany({
          data: variables.map((variable: { name: string; unitPrice: number }) => ({
            serviceId: id,
            name: variable.name,
            unitPrice: variable.unitPrice
          }))
        });
      }

      return updatedService;
    });

    // Fetch the complete service with variables
    const completeService = await prisma.service.findUnique({
      where: { id: service.id },
      include: {
        variables: true
      }
    });

    return NextResponse.json({ service: completeService });
  } catch (error) {
    console.error('Error updating service:', error);
    return NextResponse.json(
      { error: 'Failed to update service' },
      { status: 500 }
    );
  }
}

// DELETE - Delete a service (soft delete by setting isActive to false)
export async function DELETE(request: NextRequest) {
  try {
    const authHeader = request.headers.get('authorization');
    if (!authHeader) {
      return NextResponse.json(
        { error: 'Authorization header required' },
        { status: 401 }
      );
    }

    const token = authHeader.replace('Bearer ', '');
    const { data: { user }, error: authError } = await supabase.auth.getUser(token);

    if (authError || !user) {
      return NextResponse.json(
        { error: 'Invalid or expired token' },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json(
        { error: 'Service ID is required' },
        { status: 400 }
      );
    }

    // Soft delete the service
    await prisma.service.update({
      where: { id },
      data: {
        isActive: false
      }
    });

    return NextResponse.json({ message: 'Service deleted successfully' });
  } catch (error) {
    console.error('Error deleting service:', error);
    return NextResponse.json(
      { error: 'Failed to delete service' },
      { status: 500 }
    );
  }
}