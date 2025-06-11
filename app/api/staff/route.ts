import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// GET - Fetch all staff
export async function GET() {
  try {
    const staff = await prisma.staff.findMany({
      orderBy: {
        createdAt: 'desc'
      }
    });
    
    return NextResponse.json(staff);
  } catch (error) {
    console.error('Error fetching staff:', error);
    return NextResponse.json(
      { error: 'Failed to fetch staff' },
      { status: 500 }
    );
  }
}

// POST - Create new staff
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      staffImage,
      firstName,
      lastName,
      role,
      servicesRendered,
      salary,
      email,
      phoneNumber,
      address
    } = body;

    // Validate required fields
    if (!firstName || !lastName || !role || !email || !phoneNumber || !address) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Check if email already exists
    const existingStaff = await prisma.staff.findUnique({
      where: { email }
    });

    if (existingStaff) {
      return NextResponse.json(
        { error: 'Staff with this email already exists' },
        { status: 400 }
      );
    }

    const newStaff = await prisma.staff.create({
      data: {
        staffImage,
        firstName,
        lastName,
        role,
        servicesRendered: servicesRendered || [],
        salary,
        email,
        phoneNumber,
        address
      }
    });

    return NextResponse.json(newStaff, { status: 201 });
  } catch (error) {
    console.error('Error creating staff:', error);
    return NextResponse.json(
      { error: 'Failed to create staff' },
      { status: 500 }
    );
  }
}

// PUT - Update staff
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      id,
      staffImage,
      firstName,
      lastName,
      role,
      servicesRendered,
      salary,
      email,
      phoneNumber,
      address
    } = body;

    if (!id) {
      return NextResponse.json(
        { error: 'Staff ID is required' },
        { status: 400 }
      );
    }

    // Check if staff exists
    const existingStaff = await prisma.staff.findUnique({
      where: { id }
    });

    if (!existingStaff) {
      return NextResponse.json(
        { error: 'Staff not found' },
        { status: 404 }
      );
    }

    // Check if email is being changed and if it conflicts with another staff
    if (email && email !== existingStaff.email) {
      const emailConflict = await prisma.staff.findUnique({
        where: { email }
      });

      if (emailConflict) {
        return NextResponse.json(
          { error: 'Email already exists for another staff member' },
          { status: 400 }
        );
      }
    }

    const updatedStaff = await prisma.staff.update({
      where: { id },
      data: {
        staffImage,
        firstName,
        lastName,
        role,
        servicesRendered: servicesRendered || [],
        salary,
        email,
        phoneNumber,
        address
      }
    });

    return NextResponse.json(updatedStaff);
  } catch (error) {
    console.error('Error updating staff:', error);
    return NextResponse.json(
      { error: 'Failed to update staff' },
      { status: 500 }
    );
  }
}

// DELETE - Delete staff
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json(
        { error: 'Staff ID is required' },
        { status: 400 }
      );
    }

    // Check if staff exists
    const existingStaff = await prisma.staff.findUnique({
      where: { id }
    });

    if (!existingStaff) {
      return NextResponse.json(
        { error: 'Staff not found' },
        { status: 404 }
      );
    }

    await prisma.staff.delete({
      where: { id }
    });

    return NextResponse.json(
      { message: 'Staff deleted successfully' },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error deleting staff:', error);
    return NextResponse.json(
      { error: 'Failed to delete staff' },
      { status: 500 }
    );
  }
}