import * as React from "react";

import { useMediaQuery } from "@mantine/hooks";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";
import { Drawer, DrawerContent, DrawerTrigger } from "./ui/drawer";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "./ui/command";
import { Button } from "./ui/button";

type ListItem = {
  value: string | number | boolean;
  label: string;
};

export interface ComboBoxResponsive {
  placeholder: string | React.ReactNode;
  command_placeholder?: string;
  list: ListItem[];
  handleChange?: (value: string) => void;
}

export function ComboBoxResponsive(props: ComboBoxResponsive) {
  const [open, setOpen] = React.useState(false);
  const isDesktop = useMediaQuery("(min-width: 768px)");
  const [selectedItem, setSelectedItem] = React.useState<ListItem | null>(null);

  const setSelectedValue = (value: ListItem | null) => {
    if (value && props.handleChange) {
      props.handleChange(value.value.toString());
    }
    setSelectedItem(value);
  };

  if (isDesktop) {
    return (
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            role="combobox"
            variant={selectedItem ? "success" : "dark"}
            className="justify-start w-full justify-center h-14 w-52"
          >
            {selectedItem ? <>{selectedItem.label}</> : props.placeholder}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-[210px] p-0" align="start">
          <StatusList
            command_placeholder={props.command_placeholder}
            list={props.list}
            setOpen={setOpen}
            setSelectedItem={setSelectedValue}
          />
        </PopoverContent>
      </Popover>
    );
  }

  return (
    <Drawer open={open} onOpenChange={setOpen}>
      <DrawerTrigger asChild>
        <Button
          variant={selectedItem ? "success" : "dark"}
          className="justify-start w-full justify-center h-14 w-52"
        >
          {selectedItem ? <>{selectedItem.label}</> : props.placeholder}
        </Button>
      </DrawerTrigger>
      <DrawerContent>
        <StatusList
          command_placeholder={props.command_placeholder}
          list={props.list}
          setOpen={setOpen}
          setSelectedItem={setSelectedValue}
        />
      </DrawerContent>
    </Drawer>
  );
}

function StatusList({
  setOpen,
  setSelectedItem,
  list,
  command_placeholder,
}: {
  setOpen: (open: boolean) => void;
  setSelectedItem: (item: ListItem | null) => void;
  list: ListItem[];
  command_placeholder?: string;
}) {
  return (
    <Command>
      <CommandInput placeholder={command_placeholder || "Filter..."} />
      <CommandList className="scrollbar-thin">
        <CommandEmpty>Результаты не найдены</CommandEmpty>
        <CommandGroup>
          {list.map((item) => (
            <CommandItem
              key={item.value.toString()}
              value={item.value.toString()}
              onSelect={(value) => {
                setSelectedItem(
                  list.find(
                    (priority) =>
                      priority.value.toString().toLowerCase() === value
                  ) || null
                );
                setOpen(false);
              }}
            >
              {item.label}
            </CommandItem>
          ))}
        </CommandGroup>
      </CommandList>
    </Command>
  );
}
