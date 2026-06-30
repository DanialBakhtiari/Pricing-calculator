import { Controller, type Control, type FieldValues, type Path } from 'react-hook-form';
import { MoneyField } from './MoneyField';
import { NumberField } from './NumberField';
import { PercentField } from './PercentField';
import { SliderField } from './SliderField';

// پل‌های تایپ‌شده‌ی RHF ↔ فیلدهای کنترل‌شده‌ی فارسی — تکرار Controller را حذف می‌کنند.

interface FieldBase<T extends FieldValues> {
  control: Control<T>;
  name: Path<T>;
  label: string;
  tooltip?: string;
}

type NumChange = (value: number | null) => void;

export function FormMoney<T extends FieldValues>({
  control,
  name,
  label,
  tooltip,
  step,
}: FieldBase<T> & { step?: number }) {
  return (
    <Controller
      control={control}
      name={name}
      render={({ field, fieldState }) => (
        <MoneyField
          label={label}
          tooltip={tooltip}
          step={step}
          value={field.value ?? null}
          onChange={field.onChange as NumChange}
          error={fieldState.error?.message}
        />
      )}
    />
  );
}

export function FormNumber<T extends FieldValues>({
  control,
  name,
  label,
  tooltip,
  unit,
  min,
  max,
}: FieldBase<T> & { unit?: string; min?: number; max?: number }) {
  return (
    <Controller
      control={control}
      name={name}
      render={({ field, fieldState }) => (
        <NumberField
          label={label}
          tooltip={tooltip}
          unit={unit}
          min={min}
          max={max}
          value={field.value ?? null}
          onChange={field.onChange as NumChange}
          error={fieldState.error?.message}
        />
      )}
    />
  );
}

export function FormPercent<T extends FieldValues>({
  control,
  name,
  label,
  tooltip,
  min,
  max,
}: FieldBase<T> & { min?: number; max?: number }) {
  return (
    <Controller
      control={control}
      name={name}
      render={({ field, fieldState }) => (
        <PercentField
          label={label}
          tooltip={tooltip}
          min={min}
          max={max}
          value={field.value ?? null}
          onChange={field.onChange as NumChange}
          error={fieldState.error?.message}
        />
      )}
    />
  );
}

export function FormSlider<T extends FieldValues>({
  control,
  name,
  label,
  tooltip,
  min,
  max,
  step,
  fallback,
  formatValue,
}: FieldBase<T> & {
  min: number;
  max: number;
  step: number;
  fallback: number;
  formatValue?: (value: number) => string;
}) {
  return (
    <Controller
      control={control}
      name={name}
      render={({ field }) => (
        <SliderField
          label={label}
          tooltip={tooltip}
          min={min}
          max={max}
          step={step}
          formatValue={formatValue}
          value={field.value ?? fallback}
          onChange={field.onChange as (value: number) => void}
        />
      )}
    />
  );
}
