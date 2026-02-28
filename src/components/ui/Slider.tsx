/** biome-ignore-all lint/suspicious/noArrayIndexKey: N/A */
"use client";

import { Slider as SliderPrimitive } from "@base-ui/react/slider";
import { cva } from "class-variance-authority";
import { useMemo } from "react";
import { cn } from "@/lib/utils/cn";

/* ---------------------------------- */
/* Variants                           */
/* ---------------------------------- */

const sliderRootVariants = cva(
	"data-horizontal:w-full data-vertical:h-full cursor-pointer",
);

const sliderControlVariants = cva(
	"data-vertical:min-h-40 relative flex w-full touch-none items-center select-none data-disabled:opacity-50 data-vertical:h-full data-vertical:w-auto data-vertical:flex-col",
);

const sliderTrackVariants = cva(
	"bg-muted rounded-full data-horizontal:h-1.5 data-horizontal:w-full data-vertical:h-full data-vertical:w-1.5 relative grow overflow-hidden select-none",
);

const sliderIndicatorVariants = cva(
	"bg-primary select-none data-horizontal:h-full data-vertical:w-full",
);

const sliderThumbVariants = cva(
	"border-primary ring-ring/50 size-4 rounded-full border bg-white shadow-sm transition-[color,box-shadow] hover:ring-4 focus-visible:ring-4 focus-visible:outline-hidden block shrink-0 select-none disabled:pointer-events-none disabled:opacity-50",
);

/* ---------------------------------- */
/* Slider                             */

/* ---------------------------------- */

function Slider({
	className,
	defaultValue,
	value,
	min = 0,
	max = 100,
	...props
}: SliderPrimitive.Root.Props) {
	const _values = useMemo(
		() =>
			Array.isArray(value)
				? value
				: Array.isArray(defaultValue)
					? defaultValue
					: [min, max],
		[value, defaultValue, min, max],
	);

	return (
		<SliderPrimitive.Root
			data-slot="slider"
			defaultValue={defaultValue}
			value={value}
			min={min}
			max={max}
			thumbAlignment="edge"
			className={cn(sliderRootVariants(), className)}
			{...props}
		>
			<SliderPrimitive.Control className={sliderControlVariants()}>
				<SliderPrimitive.Track
					data-slot="slider-track"
					className={sliderTrackVariants()}
				>
					<SliderPrimitive.Indicator
						data-slot="slider-range"
						className={sliderIndicatorVariants()}
					/>
				</SliderPrimitive.Track>

				{Array.from({ length: _values.length }, (_, index) => (
					<SliderPrimitive.Thumb
						key={index}
						data-slot="slider-thumb"
						className={sliderThumbVariants()}
					/>
				))}
			</SliderPrimitive.Control>
		</SliderPrimitive.Root>
	);
}

export { Slider };
