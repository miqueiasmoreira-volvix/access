'use client';

export default function UserManagement({ params }: { params: { id: string } }) {
    return (
        <div>
            <h1>User Management {params.id}</h1>
        </div>
    );
}