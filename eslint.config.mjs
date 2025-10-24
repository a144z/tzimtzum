import { dirname } from "path";
import { fileURLToPath } from "url";
import { FlatCompat } from "@eslint/eslintrc";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
});

const eslintConfig = [
  ...compat.extends("next/core-web-vitals", "next/typescript"),
  {
    rules: {
      // Disable TypeScript any type warnings for p5.js compatibility
      "@typescript-eslint/no-explicit-any": "off",
      // Disable prefer-const for variables that are reassigned in loops or conditionals
      "prefer-const": "off",
    },
  },
];

export default eslintConfig;
