import { Seeder } from './seeder';
import {
  departments,
  positions,
  employees,
  formTemplates,
  formInstances,
} from './deploy-data';

const seeder = new Seeder(
  departments,
  positions,
  employees,
  formTemplates,
  formInstances,
);

const clearFirst = true;
const clearOnly = false;

seeder.seed(clearFirst, clearOnly).catch((e) => {
  console.error(e);
  process.exit(1);
});
