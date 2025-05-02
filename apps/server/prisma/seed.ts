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

seeder.seed().catch((e) => {
  console.error(e);
  process.exit(1);
});
