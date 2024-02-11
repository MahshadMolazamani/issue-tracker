import { issueSchema } from "@/app/validationSchemas";
import { NextRequest, NextResponse } from "next/server";
import prisma from "@/prisma/client";
import { getServerSession } from "next-auth";
import authOptions from "../../auth/authOptions";

// define a Typescript interface for the function parameters, specifying that params must include an id of type string.
interface Props {
    params: { id: string }
}

// Asynchronous PATCH function to handle update request, accepting a Next.js request object and custom props.
export async function PATCH(
    request: NextRequest, { params }: Props) {

        const session = await getServerSession(authOptions)
        if(!session)
            return NextResponse.json({}, { status: 401 });
    // Parse the JSON body from the incoming request
    const body = await request.json();
    // Validation the reuest body against the issueSchema, ensuring it follows the expected format. 
    const validation = issueSchema.safeParse(body);
    // check if the validation was unsuccessful and return a 400 Bad Request with the validation errors.
    if (!validation.success)
        return NextResponse.json(validation.error.format(), { status: 400 });
    // Attempt to find a unique issue from the database using the provided id, converting it to integer.
    const issue = await prisma.issue.findUnique({
        where: { id: parseInt(params.id) }
    })
    // If no issue is found matching the id, return a 404 Not Found error response.
    if (!issue) {
        return NextResponse.json({ error: 'Invalid issue' }, { status: 404 })
    }
    // Update the issue in the database with the new title and description from the request body.
    const updatedIssue = await prisma.issue.update({
        where: { id: issue.id },
        data: {
            title: body.title,
            description: body.description
        }
    });

    return NextResponse.json(updatedIssue);
    }


    export async function DELETE(request: NextRequest, {params}: {params: { id: string }}) {

        const session = await getServerSession(authOptions)
        if(!session)
            return NextResponse.json({}, { status: 401 });

        const issue = await prisma.issue.findUnique({
            where: { id: parseInt(params.id) }
        })

        if (!issue) {
            return NextResponse.json({ error: 'Invalid issue' }, { status: 404 })
        }

        await prisma.issue.delete({
            where: { id: issue.id }
        })

        return NextResponse.json({})

    }



