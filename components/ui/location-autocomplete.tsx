'use client'

import * as React from "react"
import { Check, ChevronsUpDown } from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"

const locations = [
  { value: "dubai downtown", label: "Dubai Downtown, Dubai" },
  { value: "business bay", label: "Business Bay, Dubai" },
  { value: "dubai marina", label: "Dubai Marina, Dubai" },
  { value: "jumeirah lake towers", label: "Jumeirah Lake Towers (JLT), Dubai" },
  { value: "palm jumeirah", label: "Palm Jumeirah, Dubai" },
  { value: "deira", label: "Deira, Dubai" },
  { value: "bur dubai", label: "Bur Dubai, Dubai" },
  { value: "al barsha", label: "Al Barsha, Dubai" },
  { value: "al quoz", label: "Al Quoz, Dubai" },
  { value: "jebel ali", label: "Jebel Ali, Dubai" },
  { value: "sharjah city center", label: "Sharjah City Center, Sharjah" },
  { value: "al nahda", label: "Al Nahda, Sharjah" },
  { value: "abu dhabi corniche", label: "Abu Dhabi Corniche, Abu Dhabi" },
  { value: "yas island", label: "Yas Island, Abu Dhabi" },
]

interface LocationAutocompleteProps {
  value?: string
  onChange: (value: string) => void
  placeholder?: string
}

export function LocationAutocomplete({ value, onChange, placeholder = "Select location..." }: LocationAutocompleteProps) {
  const [open, setOpen] = React.useState(false)

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-full justify-between font-normal px-3"
        >
          {value
            ? locations.find((location) => location.value === value.toLowerCase())?.label || value
            : placeholder}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[--radix-popover-trigger-width] p-0">
        <Command>
          <CommandInput placeholder="Search location..." />
          <CommandList>
            <CommandEmpty>No location found.</CommandEmpty>
            <CommandGroup>
              {locations.map((location) => (
                <CommandItem
                  key={location.value}
                  value={location.value}
                  onSelect={(currentValue) => {
                    // Use the label as the actual value for the form, or the value if preferred
                    // Here we find the label corresponding to the selected value
                    const selected = locations.find(l => l.value === currentValue)
                    onChange(selected ? selected.label : currentValue)
                    setOpen(false)
                  }}
                >
                  <Check
                    className={cn(
                      "mr-2 h-4 w-4",
                      value?.toLowerCase() === location.value ? "opacity-100" : "opacity-0"
                    )}
                  />
                  {location.label}
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  )
}
