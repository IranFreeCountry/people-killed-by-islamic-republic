import fs from "fs";
import path from "path";
import { data } from "./index";

const template = fs.readFileSync(path.join(__dirname, "/template.md"));

const entries = Object.entries(data);

(async () => {
  while (entries.length) {
    await Promise.all(
      entries.splice(0, 20).map(async ([id, data]) => {
        const folder = id.charAt(0);
        const fileName = id + ".md";
        const filePath = path.join(__dirname, "../people", folder);

        let content = template.toString();

        const mapData: {
          name: string;
          faName: string;
          born: string;
          faBorn: string;
          death: string;
          faDeath: string;
          tags: string;
          faTags: string;
          url: string;
          image: string;
        } = {
          name: data.firstName + " " + data.lastName,
          faName: data.firstNamePersian + " " + data.lastNamePersian,
          born: data.birthDate + " " + data.city,
          faBorn: data.birthDate + " " + data.city,
          death: data.deathDate + " " + data.deathCity + " " + data.deathReason,
          faDeath:
            data.deathDate +
            " " +
            data.deathCity +
            " " +
            data.deathReasonPersian,
          tags: data.tags.map((tag) => tag).join(" "),
          faTags: data.persianTags.map((tag) => tag).join(" "),
          url: data.url || "#",
          image: "../images/" + id + ".jpg",
        };

        Object.entries(mapData).forEach(([name, value]) => {
          content = replaceAll(content, `\\\${${name}}`, value);
        });

        if (!fs.existsSync(filePath)) {
          fs.mkdirSync(filePath, { recursive: true });
        }

        await fs.writeFile(
          path.join(filePath, fileName),
          content,
          function (err) {
            if (err) {
              return console.log(err);
            }
          }
        );
      })
    );
  }
})();

function replaceAll(str: string, find: string, replace: string) {
  return str.replace(new RegExp(find, "g"), replace);
}
