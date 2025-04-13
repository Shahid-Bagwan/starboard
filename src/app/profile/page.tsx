"use client"

import { useState } from "react"
import Link from "next/link"
import { ArrowLeft } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

export default function ProfilePage() {
  const [activeTab, setActiveTab] = useState("basic-info")

  return (
    <div className="container mx-auto px-2 py-6">
      <div className="flex items-center mb-6">
        <Button variant="ghost" size="icon" asChild>
          <Link href="/">
            <ArrowLeft className="h-4 w-4" />
            <span className="sr-only">Back</span>
          </Link>
        </Button>
        <h1 className="text-2xl font-bold ml-2">Profile</h1>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-[250px_1fr] gap-6">
        <Card>
          <CardHeader className="pb-4">
            <div className="flex justify-center">
              <Avatar className="h-24 w-24">
                <AvatarImage src="/placeholder.svg" alt="User" />
                <AvatarFallback>U</AvatarFallback>
              </Avatar>
            </div>
            <CardTitle className="text-center mt-4">John Smith</CardTitle>
            <CardDescription className="text-center">john.smith@example.com</CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className="grid grid-cols-1 w-full">
                <TabsTrigger value="basic-info">Basic Info</TabsTrigger>
              </TabsList>
            </Tabs>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Basic Information</CardTitle>
            <CardDescription>Your personal information</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <h3 className="text-sm font-medium text-muted-foreground">Full Name</h3>
                <p>John Smith</p>
              </div>
              <div>
                <h3 className="text-sm font-medium text-muted-foreground">Email</h3>
                <p>john.smith@example.com</p>
              </div>
              <div>
                <h3 className="text-sm font-medium text-muted-foreground">Role</h3>
                <p>Senior Analyst</p>
              </div>
              <div>
                <h3 className="text-sm font-medium text-muted-foreground">Department</h3>
                <p>Real Estate Investments</p>
              </div>
              <div>
                <h3 className="text-sm font-medium text-muted-foreground">Location</h3>
                <p>New York, NY</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
