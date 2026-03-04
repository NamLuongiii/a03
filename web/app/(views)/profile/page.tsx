import {Card} from '@heroui/react'
import {getAuthMe} from '@/app/api'

export default async function ProfilePage() {
    const res = await getAuthMe()
    const user = res.data?.data

    if (!user) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <p className="text-default-500">User not found</p>
            </div>
        )
    }

    return (
        <div className="bg-background px-4 py-10 flex justify-center">
            <Card className="w-full max-w-2xl p-8 space-y-6">
                {/* Header */}
                <div className="flex items-center gap-4">
                    <div>
                        <h1 className="text-2xl font-semibold">
                            {user.name}
                        </h1>
                        <p className="text-default-500 text-sm">
                            {user.email}
                        </p>
                    </div>
                </div>
            </Card>
        </div>
    )
}

