'use client'

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useAppDispatch } from "@/store/hooks"
import { schedulePickup } from "@/store/slices/pickupSlice"
import { useRouter } from "next/navigation"
import { useState } from "react"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { CalendarIcon } from "lucide-react"
import { format } from "date-fns"
import { cn } from "@/lib/utils"
import { LocationAutocomplete } from "@/components/ui/location-autocomplete"

const formSchema = z.object({
  awbNumber: z.string().min(3, {
    message: "AWB Number is required.",
  }),
  contactName: z.string().min(2, {
    message: "Contact name is required.",
  }),
  contactPhone: z.string().min(10, {
    message: "Valid phone number is required.",
  }),
  address: z.string().min(5, {
    message: "Address is required.",
  }),
  serviceType: z.string({
    message: "Please select a service type.",
  }),
  scheduledDate: z.date({
    message: "A pickup date is required.",
  }),
})

export function SchedulePickupForm() {
  const dispatch = useAppDispatch()
  const router = useRouter()
  const [loading, setLoading] = useState(false)

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      awbNumber: "",
      contactName: "",
      contactPhone: "",
      address: "",
      serviceType: "Standard",
    },
  })

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setLoading(true)
    try {
      await dispatch(schedulePickup({
        ...values,
        scheduledDate: values.scheduledDate.toISOString(),
        location: values.address, // Using address as location for now
        status: 'Requested'
      })).unwrap()
      router.push('/pickups')
    } catch (error) {
      console.error('Failed to schedule pickup:', error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8 bg-card p-6 rounded-md">
        <div className="grid grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="awbNumber"
            render={({ field }) => (
              <FormItem className="col-span-2 md:col-span-1">
                <FormLabel>Shipment AWB Number</FormLabel>
                <FormControl>
                  <Input placeholder="Enter AWB Number" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <div className="hidden md:block col-span-1"></div>

          <FormField
            control={form.control}
            name="contactName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Contact Name</FormLabel>
                <FormControl>
                  <Input placeholder="John Doe" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="contactPhone"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Phone Number</FormLabel>
                <FormControl>
                  <Input placeholder="+971..." {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="address"
          render={({ field }) => (
            <FormItem className="col-span-2">
              <FormLabel>Pickup Address</FormLabel>
              <FormControl>
                <LocationAutocomplete
                  value={field.value}
                  onChange={field.onChange}
                  placeholder="Search pickup location..."
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="grid grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="serviceType"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Service Type</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select service type" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="Standard">Standard Delivery</SelectItem>
                    <SelectItem value="Express">Express Delivery</SelectItem>
                    <SelectItem value="SameDay">Same Day</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="scheduledDate"
            render={({ field }) => (
              <FormItem className="flex flex-col">
                <FormLabel>Scheduled Date</FormLabel>
                <Popover>
                  <PopoverTrigger asChild>
                    <FormControl>
                      <Button
                        variant={"outline"}
                        className={cn(
                          "w-full pl-3 text-left font-normal",
                          !field.value && "text-muted-foreground"
                        )}
                      >
                        {field.value ? (
                          format(field.value, "PPP")
                        ) : (
                          <span>Pick a date</span>
                        )}
                        <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                      </Button>
                    </FormControl>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={field.value}
                      onSelect={field.onChange}
                      disabled={(date) =>
                        date < new Date(new Date().setHours(0, 0, 0, 0))
                      }
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <Button type="submit" disabled={loading}>
          {loading ? 'Scheduling...' : 'Schedule Pickup'}
        </Button>
      </form>
    </Form>
  )
}
