import * as React from "react";
import { Check, ChevronsUpDown, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList, CommandSeparator } from "@/components/ui/command";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";

export interface MultiSelectOption {
  value: string;
  label: string;
  description?: string;
  icon?: React.ReactNode;
  disabled?: boolean;
  group?: string;
}

export interface MultiSelectCommandProps {
  options: MultiSelectOption[];
  value: string[];
  onChange: (value: string[]) => void;
  placeholder?: string;
  searchPlaceholder?: string;
  emptyMessage?: string;
  maxDisplayedBadges?: number;
  maxSelections?: number;
  showSelectAll?: boolean;
  showClear?: boolean;
  disabled?: boolean;
  className?: string;
  "aria-label"?: string;
}

export function MultiSelectCommand({
  options,
  value,
  onChange,
  placeholder = "Selecione opções...",
  searchPlaceholder = "Buscar...",
  emptyMessage = "Nenhuma opção encontrada.",
  maxDisplayedBadges = 3,
  maxSelections,
  showSelectAll = true,
  showClear = true,
  disabled = false,
  className,
  "aria-label": ariaLabel,
}: MultiSelectCommandProps) {
  const [open, setOpen] = React.useState(false);
  const [search, setSearch] = React.useState("");

  // Agrupa opções por grupo
  const groupedOptions = React.useMemo(() => {
    const groups: Record<string, MultiSelectOption[]> = {};
    const ungrouped: MultiSelectOption[] = [];

    options.forEach((option) => {
      if (option.group) {
        if (!groups[option.group]) {
          groups[option.group] = [];
        }
        groups[option.group].push(option);
      } else {
        ungrouped.push(option);
      }
    });

    return { groups, ungrouped };
  }, [options]);

  const handleSelect = (optionValue: string) => {
    if (value.includes(optionValue)) {
      onChange(value.filter((v) => v !== optionValue));
    } else {
      if (maxSelections && value.length >= maxSelections) {
        return;
      }
      onChange([...value, optionValue]);
    }
  };

  const handleRemove = (optionValue: string, e: React.MouseEvent) => {
    e.stopPropagation();
    onChange(value.filter((v) => v !== optionValue));
  };

  const handleSelectAll = () => {
    const selectableOptions = options.filter((o) => !o.disabled).map((o) => o.value);

    if (maxSelections) {
      onChange(selectableOptions.slice(0, maxSelections));
    } else {
      onChange(selectableOptions);
    }
  };

  const handleClearAll = () => {
    onChange([]);
  };

  const selectedLabels = value.map((v) => options.find((o) => o.value === v)?.label).filter(Boolean) as string[];

  const displayedBadges = selectedLabels.slice(0, maxDisplayedBadges);
  const remainingCount = selectedLabels.length - maxDisplayedBadges;

  const renderOptions = (optionsList: MultiSelectOption[]) => {
    return optionsList.map((option) => {
      const isSelected = value.includes(option.value);
      const isDisabled = option.disabled || (maxSelections && value.length >= maxSelections && !isSelected);

      return (
        <CommandItem
          key={option.value}
          value={option.label}
          onSelect={() => !isDisabled && handleSelect(option.value)}
          disabled={isDisabled as boolean}
          className={cn("flex items-center gap-2 cursor-pointer", isDisabled && "opacity-50 cursor-not-allowed")}
        >
          <div className={cn("flex h-4 w-4 items-center justify-center rounded border border-primary", isSelected ? "bg-primary text-primary-foreground" : "opacity-50")}>
            {isSelected && <Check className="h-3 w-3" />}
          </div>
          {option.icon && <span className="flex-shrink-0">{option.icon}</span>}
          <div className="flex flex-col">
            <span>{option.label}</span>
            {option.description && <span className="text-xs text-muted-foreground">{option.description}</span>}
          </div>
        </CommandItem>
      );
    });
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          aria-label={ariaLabel || placeholder}
          aria-haspopup="listbox"
          disabled={disabled}
          className={cn("w-full justify-between min-h-10 h-auto", !value.length && "text-muted-foreground", className)}
        >
          <div className="flex flex-wrap gap-1 items-center">
            {value.length === 0 ? (
              <span>{placeholder}</span>
            ) : (
              <>
                {displayedBadges.map((label) => {
                  const optionValue = options.find((o) => o.label === label)?.value;
                  return (
                    <Badge key={optionValue} variant="secondary" className="text-xs px-1.5 py-0.5 gap-1">
                      {label}
                      <button
                        type="button"
                        onClick={(e) => optionValue && handleRemove(optionValue, e)}
                        className="ml-0.5 rounded-full hover:bg-muted-foreground/20 p-0.5"
                        aria-label={`Remover ${label}`}
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </Badge>
                  );
                })}
                {remainingCount > 0 && (
                  <Badge variant="secondary" className="text-xs px-1.5 py-0.5">
                    +{remainingCount}
                  </Badge>
                )}
              </>
            )}
          </div>
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[var(--radix-popover-trigger-width)] p-0" align="start">
        <Command>
          <CommandInput placeholder={searchPlaceholder} value={search} onValueChange={setSearch} />
          <CommandList>
            <CommandEmpty>{emptyMessage}</CommandEmpty>

            {(showSelectAll || showClear) && (
              <>
                <CommandGroup>
                  <div className="flex items-center gap-2 p-2">
                    {showSelectAll && (
                      <Button variant="ghost" size="sm" className="h-7 text-xs" onClick={handleSelectAll} disabled={maxSelections ? value.length >= maxSelections : false}>
                        Selecionar todos
                      </Button>
                    )}
                    {showClear && value.length > 0 && (
                      <Button variant="ghost" size="sm" className="h-7 text-xs" onClick={handleClearAll}>
                        Limpar
                      </Button>
                    )}
                    {maxSelections && (
                      <span className="ml-auto text-xs text-muted-foreground">
                        {value.length}/{maxSelections}
                      </span>
                    )}
                  </div>
                </CommandGroup>
                <CommandSeparator />
              </>
            )}

            {/* Opções sem grupo */}
            {groupedOptions.ungrouped.length > 0 && <CommandGroup>{renderOptions(groupedOptions.ungrouped)}</CommandGroup>}

            {/* Opções agrupadas */}
            {Object.entries(groupedOptions.groups).map(([group, groupOptions]) => (
              <CommandGroup key={group} heading={group}>
                {renderOptions(groupOptions)}
              </CommandGroup>
            ))}
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
