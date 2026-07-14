import { useRef, useState } from "react";
import { ChevronDown } from "lucide-react";
import { useClickOutside } from "@/customHooks/useClickOutside";
import defaultColors from "@/data/colors";

export default function ColorPicker({
  value,
  onChange,
  colors = defaultColors,
  label = "Color",
}) {
  const [isOpen, setIsOpen] = useState(false);
  const colorPickerRef = useRef(null);

  useClickOutside(
    colorPickerRef,
    () => setIsOpen(false)
  );

  return (
    <div className="flex flex-col gap-2">
      <label className="text-sm font-medium text-gray-300">
        {label}
      </label>

      <div className="relative w-full" ref={colorPickerRef}>
        <button
          type="button"
          onClick={() => setIsOpen((prev) => !prev)}
          className={`
            w-full
            flex
            items-center
            justify-between
            rounded-lg
            border
            px-4
            py-3
            transition-colors
            bg-gray-900
            ${
              isOpen
                ? "border-cyan-600"
                : "border-gray-700"
            }
          `}
        >
          <div className="flex items-center gap-3">
            <div
              className="w-5 h-5 rounded-full border border-white/20"
              style={{ backgroundColor: value }}
            />

            <span className="text-gray-300">
              Seleccionar color
            </span>
          </div>

          <ChevronDown
            className={`
              h-5
              w-5
              text-gray-400
              transition-transform
              ${isOpen ? "rotate-180" : ""}
            `}
          />
        </button>

        {isOpen && (
          <div
            className="
              absolute
              left-0
              mt-2
              w-full
              rounded-xl
              border
              border-gray-700
              bg-gray-900
              p-4
              shadow-xl
              z-50
            "
          >
            <div className="grid grid-cols-4 lg:grid-cols-6 gap-3">
              {colors.map((color) => (
                <button
                  key={color}
                  type="button"
                  onClick={() => {
                    onChange(color);
                    setIsOpen(false);
                  }}
                  className={`
                    h-6
                    w-6
                    md:h-7
                    md:w-7
                    lg:h-8
                    lg:w-8
                    rounded-full
                    transition-all
                    cursor-pointer
                    hover:scale-110
                    ${
                      value === color
                        ? "ring-2 ring-white"
                        : ""
                    }
                  `}
                  style={{ backgroundColor: color }}
                />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}