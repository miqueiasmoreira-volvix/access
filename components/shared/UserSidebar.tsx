import Image from "next/image";

export default function UserSidebar() {
    return (
        <div>
            <div>
                <Image
                src="/images/user.png"
                alt="User"
                width={32}
                height={32}
                />
            </div>
        </div>
    )
}
