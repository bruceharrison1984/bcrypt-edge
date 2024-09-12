import { defineBuildConfig } from "unbuild";

export default defineBuildConfig({
  entries: ["src/bcrypt-edge.ts"],
  declaration: true,
});
