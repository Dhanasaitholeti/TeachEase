"use client";
import React, { useState } from "react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from "@/app/component/ui/card";
import { Input } from "@/app/component/ui/input";
import { Button } from "@/app/component/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/app/component/ui/select";
import { Calendar } from "@/app/component/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/app/component/ui/popover";
import { format } from "date-fns";
import { CalendarIcon } from "lucide-react";
import { Label } from "@/app/component/ui/label";
import { Textarea } from "@/app/component/ui/textarea";
import DynamicBreadcrumb from "@/app/component/DynamicBreadCrumb/DynamicBreadCrumb";
import { createTodo } from "@/service/class";
import { toast } from "react-toastify";

export default function TodoForm() {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    priority: "medium",
    dateOfReminder: new Date(),
    status: "pending",
  });

  const teacherId =
    typeof window !== "undefined"
      ? JSON.parse(localStorage.getItem("userData") || "{}").id
      : "";

  const handleSubmit = async (e) => {
    e.preventDefault();

    const todoData = {
      ...formData,
      teacherId,
    };

    try {
      await createTodo(todoData);
      toast.success("Todo List Created");
    } catch (error) {
      console.error("Error submitting todo:", error);
    }
  };

  return (
    <div className="py-10 px-5">
      <DynamicBreadcrumb
        items={[
          { label: "Home", href: "/teacher/dashboard" },
          { label: "Todo", href: "/teacher/dashboard/to-do" },
        ]}
      />
      <div className="min-h-screen bg-gray-100 flex flex-col items-center ">
        <Card className="w-full ">
          <CardHeader>
            <CardTitle className="text-2xl font-bold text-center">
              Create New Todo
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="title">Title</Label>
                <Input
                  id="title"
                  value={formData.title}
                  onChange={(e) =>
                    setFormData({ ...formData, title: e.target.value })
                  }
                  required
                  className="w-full"
                  placeholder="Enter todo title"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) =>
                    setFormData({ ...formData, description: e.target.value })
                  }
                  className="w-full"
                  placeholder="Enter description"
                  rows={3}
                />
              </div>

              <div className="space-y-2">
                <Label>Priority</Label>
                <Select
                  value={formData.priority}
                  onValueChange={(value) =>
                    setFormData({ ...formData, priority: value })
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select priority" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="low">Low</SelectItem>
                    <SelectItem value="medium">Medium</SelectItem>
                    <SelectItem value="high">High</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Reminder Date</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className="w-full justify-start text-left font-normal"
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {format(formData.dateOfReminder, "PPP")}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar
                      mode="single"
                      selected={formData.dateOfReminder}
                      onSelect={(date) =>
                        setFormData({
                          ...formData,
                          dateOfReminder: date || new Date(),
                        })
                      }
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </div>

              <div className="space-y-2">
                <Label>Status</Label>
                <Select
                  value={formData.status}
                  onValueChange={(value) =>
                    setFormData({ ...formData, status: value })
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="pending">Pending</SelectItem>
                    <SelectItem value="in-progress">In Progress</SelectItem>
                    <SelectItem value="completed">Completed</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <Button
                type="submit"
                className="w-full bg-blue-600 hover:bg-blue-600"
              >
                Create Todo
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
