import { useTheme, type ThemeName } from "@/contexts/ThemeContext";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Palette, Sun, Moon } from "lucide-react";

const themes: { name: ThemeName; label: string }[] = [
    { name: "blue", label: "Blue" },
    { name: "red", label: "Red (Kedai Bunda)" },
    { name: "amber-minimal", label: "Amber Minimal" },
    { name: "amethyst-haze", label: "Amethyst Haze" },
    { name: "art-deco", label: "Art Deco" },
    { name: "catppuccin", label: "Catppuccin" },
    { name: "nature", label: "Nature" },
    { name: "ocean-breeze", label: "Ocean Breeze" },
];

export function ThemeSwitcher() {
    const { theme, variant, setTheme, setVariant } = useTheme();

    const currentTheme = themes.find((t) => t.name === theme);

    return (
        <div className="flex items-center gap-2">
            {/* Theme Selector */}
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button variant="outline" size="sm" className="gap-2">
                        <Palette className="h-4 w-4" />
                        <span className="hidden md:inline">
                            {currentTheme?.label || "Theme"}
                        </span>
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                    <DropdownMenuLabel>Pilih Tema</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    {themes.map((t) => (
                        <DropdownMenuItem
                            key={t.name}
                            onClick={() => setTheme(t.name)}
                            className={`cursor-pointer ${
                                theme === t.name ? "bg-accent" : ""
                            }`}
                        >
                            <div className="flex items-center gap-2 w-full">
                                <div
                                    className="w-4 h-4 rounded-full border"
                                    style={{
                                        background: getThemePreviewColor(
                                            t.name
                                        ),
                                    }}
                                />
                                <span>{t.label}</span>
                            </div>
                        </DropdownMenuItem>
                    ))}
                </DropdownMenuContent>
            </DropdownMenu>

            {/* Light/Dark Toggle */}
            <Button
                variant="outline"
                size="sm"
                onClick={() =>
                    setVariant(variant === "light" ? "dark" : "light")
                }
                className="h-9 w-9 p-0"
            >
                {variant === "light" ? (
                    <Sun className="h-4 w-4" />
                ) : (
                    <Moon className="h-4 w-4" />
                )}
            </Button>
        </div>
    );
}

// Preview colors for themes
function getThemePreviewColor(theme: ThemeName): string {
    const colors: Record<ThemeName, string> = {
        blue: "oklch(0.62 0.21 259.23)",
        red: "oklch(0.55 0.22 11.32)",
        "amber-minimal": "oklch(0.78 0.08 45.00)",
        "amethyst-haze": "oklch(0.61 0.08 299.75)",
        "art-deco": "oklch(0.77 0.14 91.27)",
        catppuccin: "oklch(0.61 0.24 293.46)",
        nature: "oklch(0.64 0.18 142.5)",
        "ocean-breeze": "oklch(0.60 0.11 184.15)",
    };
    return colors[theme];
}
