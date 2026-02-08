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
import { LocationAutocomplete } from "@/components/ui/location-autocomplete"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useAppDispatch } from "@/store/hooks"
import { createShipment, updateShipmentDetails, Shipment } from "@/store/slices/shipmentSlice"
import { useRouter } from "next/navigation"
import { useState } from "react"

const formSchema = z.object({
  orderId: z.string().min(2, {
    message: "Order ID must be at least 2 characters.",
  }),
  consigneeName: z.string().min(2, {
    message: "Consignee name is required.",
  }),
  consigneePhone: z.string().min(10, {
    message: "Valid phone number is required.",
  }),
  address: z.string().min(5, {
    message: "Address is required.",
  }),
  serviceType: z.string({
    message: "Please select a service type.",
  }),
  weight: z.string().refine((val) => !isNaN(Number(val)), {
    message: "Weight must be a number",
  }),
})

interface ShipmentFormProps {
  initialData?: Shipment;
  isEdit?: boolean;
}

export function ShipmentForm({ initialData, isEdit = false }: ShipmentFormProps) {
  const dispatch = useAppDispatch()
  const router = useRouter()
  const [loading, setLoading] = useState(false)

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      orderId: initialData?.orderId || "",
      consigneeName: initialData?.consigneeName || "",
      consigneePhone: initialData?.consigneePhone || "",
      address: initialData?.address || "",
      serviceType: initialData?.serviceType || "Standard",
      weight: initialData?.weight ? String(initialData.weight) : "1",
    },
  })

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setLoading(true)
    try {
      if (isEdit && initialData) {
        await dispatch(updateShipmentDetails({
          id: initialData.id,
          data: {
            ...values,
            weight: Number(values.weight),
          }
        })).unwrap()
      } else {
        await dispatch(createShipment({
          ...values,
          weight: Number(values.weight),
        })).unwrap()
      }
      router.push('/shipments')
    } catch (error) {
      console.error('Failed to save shipment:', error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8 bg-card p-6 rounded-md">
        <FormField
          control={form.control}
          name="orderId"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Order ID</FormLabel>
              <FormControl>
                <Input placeholder="ORD-12345" {...field} disabled={isEdit} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="grid grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="consigneeName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Consignee Name</FormLabel>
                <FormControl>
                  <Input placeholder="John Doe" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="consigneePhone"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Phone Number</FormLabel>
                <FormControl>
                  <Input placeholder="+971 50 123 4567" {...field} />
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
            <FormItem>
              <FormLabel>Delivery Address</FormLabel>
              <FormControl>
                <LocationAutocomplete
                  value={field.value}
                  onChange={field.onChange}
                  placeholder="Search delivery location..."
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
                      <SelectValue placeholder="Select a service type" />
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
            name="weight"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Weight (kg)</FormLabel>
                <FormControl>
                  <Input type="number" step="0.1" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <div className="flex justify-end gap-4">
          <Button type="button" variant="outline" onClick={() => router.back()}>Cancel</Button>
          <Button type="submit" disabled={loading}>
            {loading ? 'Saving...' : (isEdit ? 'Update Shipment' : 'Create Shipment')}
          </Button>
        </div>
      </form>
    </Form>
  )
}
