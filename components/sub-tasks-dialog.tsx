"use client"

import { useState } from "react"
import { SubTask } from "@/lib/data"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Trash2, Plus, CheckCircle, Circle } from "lucide-react"

interface SubTasksDialogProps {
  workOrderId: string
  subTasks: SubTask[]
  onUpdateSubTasks: (workOrderId: string, subTasks: SubTask[]) => void
}

export function SubTasksDialog({ workOrderId, subTasks, onUpdateSubTasks }: SubTasksDialogProps) {
  const [open, setOpen] = useState(false)
  const [newTaskTitle, setNewTaskTitle] = useState("")
  const [localSubTasks, setLocalSubTasks] = useState<SubTask[]>(subTasks)

  function handleAddSubTask() {
    if (!newTaskTitle.trim()) return

    const newSubTask: SubTask = {
      id: `ST-${Math.random().toString(36).substr(2, 9)}`,
      title: newTaskTitle,
      completed: false,
    }

    const updated = [...localSubTasks, newSubTask]
    setLocalSubTasks(updated)
    setNewTaskTitle("")
  }

  function handleToggleSubTask(id: string) {
    const updated = localSubTasks.map((task) => (task.id === id ? { ...task, completed: !task.completed } : task))
    setLocalSubTasks(updated)
  }

  function handleDeleteSubTask(id: string) {
    const updated = localSubTasks.filter((task) => task.id !== id)
    setLocalSubTasks(updated)
  }

  function handleSave() {
    onUpdateSubTasks(workOrderId, localSubTasks)
    setOpen(false)
  }

  const completedCount = localSubTasks.filter((t) => t.completed).length

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger>
        <Button variant="ghost" size="sm" className="h-6 px-2 text-xs">
          Sub-tasks ({completedCount}/{localSubTasks.length})
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Manage Sub-tasks</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="new-task">Add New Sub-task</Label>
            <div className="flex gap-2">
              <Input
                id="new-task"
                placeholder="Enter sub-task description"
                value={newTaskTitle}
                onChange={(e) => setNewTaskTitle(e.target.value)}
                onKeyPress={(e) => e.key === "Enter" && handleAddSubTask()}
              />
              <Button size="sm" onClick={handleAddSubTask} className="px-3">
                <Plus className="size-3" />
              </Button>
            </div>
          </div>

          <div className="space-y-2">
            <Label>Sub-tasks</Label>
            <div className="space-y-2 max-h-64 overflow-y-auto border border-border rounded-lg p-3">
              {localSubTasks.length === 0 ? (
                <p className="text-xs text-muted-foreground">No sub-tasks yet. Add one to get started.</p>
              ) : (
                localSubTasks.map((task) => (
                  <div key={task.id} className="flex items-center gap-2 p-2 rounded hover:bg-secondary/50">
                    <button
                      onClick={() => handleToggleSubTask(task.id)}
                      className="flex-shrink-0 focus:outline-none"
                    >
                      {task.completed ? (
                        <CheckCircle className="size-4 text-green-600" />
                      ) : (
                        <Circle className="size-4 text-muted-foreground" />
                      )}
                    </button>
                    <span
                      className={`flex-1 text-sm ${
                        task.completed ? "line-through text-muted-foreground" : "text-foreground"
                      }`}
                    >
                      {task.title}
                    </span>
                    <button
                      onClick={() => handleDeleteSubTask(task.id)}
                      className="flex-shrink-0 text-destructive hover:text-destructive/80 focus:outline-none"
                    >
                      <Trash2 className="size-3" />
                    </button>
                  </div>
                ))
              )}
            </div>
          </div>

          <div className="flex gap-3 pt-4">
            <Button variant="outline" onClick={() => setOpen(false)} className="flex-1">
              Cancel
            </Button>
            <Button onClick={handleSave} className="flex-1">
              Save Sub-tasks
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
