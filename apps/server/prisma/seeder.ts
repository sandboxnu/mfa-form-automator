import { PrismaClient } from '@prisma/client';
import {
  DepartmentData,
  PositionData,
  EmployeeData,
  FormTemplateData,
  FormInstanceData,
} from './seed.types';

export class Seeder {
  private prisma: PrismaClient;
  private departments: DepartmentData[];
  private positions: PositionData[];
  private employees: EmployeeData[];
  private formTemplates: FormTemplateData[];
  private formInstances: FormInstanceData[];

  constructor(
    departments: DepartmentData[],
    positions: PositionData[],
    employees: EmployeeData[],
    formTemplates: FormTemplateData[],
    formInstances: FormInstanceData[],
  ) {
    this.prisma = new PrismaClient();
    this.departments = departments;
    this.positions = positions;
    this.employees = employees;
    this.formTemplates = formTemplates;
    this.formInstances = formInstances;
  }

  /**
   * Alternative method to clear all tables without requiring superuser privileges
   * This works by dropping constraints manually and restoring them after clearing
   */
  async clearAllTables() {
    try {
      console.log('Starting database clear operation...');

      // Determine database type
      const databaseUrl = process.env.DATABASE_URL || '';
      const isPostgres =
        databaseUrl.includes('postgres') || databaseUrl.includes('postgresql');
      const isMySql = databaseUrl.includes('mysql');
      const isSqlite = databaseUrl.includes('sqlite');

      if (isPostgres) {
        console.log(
          'Using alternative method for PostgreSQL without superuser privileges',
        );

        // Method 1: Use TRUNCATE with CASCADE option (works if your PostgreSQL version supports it)
        try {
          // List of tables to truncate in appropriate order
          const tables = [
            'InstanceBox',
            'AssignedGroup',
            'FormInstance',
            'TemplateBox',
            'FieldGroup',
            'FormTemplate',
            'Employee',
            'Position',
            'Department',
          ];

          // Convert to snake_case for SQL (assuming your table names are in PascalCase in the code)
          const sqlTables = tables.map((table) => {
            // Convert PascalCase to snake_case
            return table
              .replace(/([A-Z])/g, '_$1')
              .toLowerCase()
              .substring(1);
          });

          // TRUNCATE with CASCADE to bypass foreign key constraints
          const truncateQuery = `TRUNCATE TABLE ${sqlTables.join(
            ', ',
          )} CASCADE;`;
          await this.prisma.$executeRawUnsafe(truncateQuery);

          console.log('All tables truncated successfully using CASCADE option');
          return;
        } catch (truncateError) {
          console.log(
            'CASCADE truncate not supported, trying alternative approach:',
            truncateError.message,
          );
        }

        // Method 2: If CASCADE doesn't work, delete in order - more compatible approach
        // Clear tables in reverse order of dependencies without disabling constraints
        const tableDeleteOperations = [
          this.prisma.instanceBox.deleteMany(),
          this.prisma.assignedGroup.deleteMany(),
          this.prisma.formInstance.deleteMany(),
          this.prisma.templateBox.deleteMany(),
          this.prisma.fieldGroup.deleteMany(),
          this.prisma.formTemplate.deleteMany(),
          this.prisma.employee.deleteMany(),
          this.prisma.position.deleteMany(),
          this.prisma.department.deleteMany(),
        ];

        // Execute delete operations one by one to handle dependencies
        const tableNames = [
          'InstanceBox',
          'AssignedGroup',
          'FormInstance',
          'TemplateBox',
          'FieldGroup',
          'FormTemplate',
          'Employee',
          'Position',
          'Department',
        ];

        for (let i = 0; i < tableDeleteOperations.length; i++) {
          try {
            const result = await tableDeleteOperations[i];
            console.log(
              `Cleared ${tableNames[i]}: ${result.count} records deleted`,
            );
          } catch (error) {
            console.error(`Error clearing ${tableNames[i]}:`, error.message);
            // Continue with next table even if one fails
          }
        }
      } else if (isMySql) {
        console.log('Detected MySQL database');
        await this.prisma.$executeRawUnsafe(`SET FOREIGN_KEY_CHECKS = 0;`);

        // Clear tables in reverse order of dependencies
        const tableDeleteOperations = [
          this.prisma.instanceBox.deleteMany(),
          this.prisma.assignedGroup.deleteMany(),
          this.prisma.formInstance.deleteMany(),
          this.prisma.templateBox.deleteMany(),
          this.prisma.fieldGroup.deleteMany(),
          this.prisma.formTemplate.deleteMany(),
          this.prisma.employee.deleteMany(),
          this.prisma.position.deleteMany(),
          this.prisma.department.deleteMany(),
        ];

        // Execute all delete operations
        const results = await this.prisma.$transaction(tableDeleteOperations);

        // Log results
        const tableNames = [
          'InstanceBox',
          'AssignedGroup',
          'FormInstance',
          'TemplateBox',
          'FieldGroup',
          'FormTemplate',
          'Employee',
          'Position',
          'Department',
        ];

        results.forEach((result, index) => {
          console.log(
            `Cleared ${tableNames[index]}: ${result.count} records deleted`,
          );
        });

        // Re-enable foreign key constraints
        await this.prisma.$executeRawUnsafe(`SET FOREIGN_KEY_CHECKS = 1;`);
      } else if (isSqlite) {
        console.log('Detected SQLite database');
        await this.prisma.$executeRawUnsafe(`PRAGMA foreign_keys = OFF;`);

        // Clear tables in reverse order of dependencies
        const tableDeleteOperations = [
          this.prisma.instanceBox.deleteMany(),
          this.prisma.assignedGroup.deleteMany(),
          this.prisma.formInstance.deleteMany(),
          this.prisma.templateBox.deleteMany(),
          this.prisma.fieldGroup.deleteMany(),
          this.prisma.formTemplate.deleteMany(),
          this.prisma.employee.deleteMany(),
          this.prisma.position.deleteMany(),
          this.prisma.department.deleteMany(),
        ];

        // Execute all delete operations
        const results = await this.prisma.$transaction(tableDeleteOperations);

        // Log results
        const tableNames = [
          'InstanceBox',
          'AssignedGroup',
          'FormInstance',
          'TemplateBox',
          'FieldGroup',
          'FormTemplate',
          'Employee',
          'Position',
          'Department',
        ];

        results.forEach((result, index) => {
          console.log(
            `Cleared ${tableNames[index]}: ${result.count} records deleted`,
          );
        });

        // Re-enable foreign key constraints
        await this.prisma.$executeRawUnsafe(`PRAGMA foreign_keys = ON;`);
      } else {
        console.log(
          'Database type not detected, attempting sequential deletion',
        );

        // Clear tables in reverse order of dependencies
        const tableDeleteOperations = [
          this.prisma.instanceBox.deleteMany(),
          this.prisma.assignedGroup.deleteMany(),
          this.prisma.formInstance.deleteMany(),
          this.prisma.templateBox.deleteMany(),
          this.prisma.fieldGroup.deleteMany(),
          this.prisma.formTemplate.deleteMany(),
          this.prisma.employee.deleteMany(),
          this.prisma.position.deleteMany(),
          this.prisma.department.deleteMany(),
        ];

        // Execute delete operations one by one to handle dependencies
        const tableNames = [
          'InstanceBox',
          'AssignedGroup',
          'FormInstance',
          'TemplateBox',
          'FieldGroup',
          'FormTemplate',
          'Employee',
          'Position',
          'Department',
        ];

        for (let i = 0; i < tableDeleteOperations.length; i++) {
          try {
            const result = await tableDeleteOperations[i];
            console.log(
              `Cleared ${tableNames[i]}: ${result.count} records deleted`,
            );
          } catch (error) {
            console.error(`Error clearing ${tableNames[i]}:`, error.message);
            // Continue with next table even if one fails
          }
        }
      }

      console.log('All tables cleared successfully');
    } catch (error) {
      console.error('Error clearing database tables:', error);
      throw error;
    }
  }

  /**
   * Seed the database with test data
   * @param clearFirst If true, clear all tables before seeding (default: false)
   */
  async seed(clearFirst = false, clearOnly = false) {
    try {
      if (clearFirst) {
        console.log('Clearing existing data before seeding...');
        await this.clearAllTables();

        if (clearOnly) {
          console.log('Clear operation completed successfully');
          await this.closeConnection();
          return;
        }
      }

      console.log('Starting seed operation...');

      for (const department of this.departments) {
        await this.upsertDepartment(department);
      }

      // make sure that departments specified in each position are valid
      for (const position of this.positions) {
        if (
          !this.departments.find((dept) => dept.id === position.departmentId)
        ) {
          throw new Error('Department not found for position');
        }
      }
      for (const position of this.positions) {
        await this.upsertPosition(position);
      }

      // make sure that positions specified in each employee are valid
      for (const employee of this.employees) {
        if (
          employee.positionId &&
          !this.positions.find((pos) => pos.id === employee.positionId)
        ) {
          throw new Error('Position not found for employee');
        }
      }
      for (const employee of this.employees) {
        await this.upsertEmployee(employee);
      }

      for (const formTemplate of this.formTemplates) {
        await this.upsertFormTemplate(formTemplate);
      }

      // make sure that form templates specified in each form instance are valid
      for (const formInstance of this.formInstances) {
        if (
          !this.formTemplates.find(
            (temp) => temp.id === formInstance.formTemplateId,
          )
        ) {
          throw new Error('Form template not found for form instance');
        }
      }
      // make sure that originator ids are all valid employees
      for (const formInstance of this.formInstances) {
        if (
          !this.employees.find((emp) => emp.id === formInstance.originatorId)
        ) {
          throw new Error('Originator not found for form instance');
        }
      }
      // make sure assigned group signer ids are all valid employees, positions, or departments
      for (const formInstance of this.formInstances) {
        for (const assignedGroup of formInstance.assignedGroups) {
          if (assignedGroup.signerType === 'USER') {
            if (!assignedGroup.signerEmployeeId) {
              throw new Error('Missing signer employee id');
            }
            if (
              !this.employees.find(
                (emp) => emp.id === assignedGroup.signerEmployeeId,
              )
            ) {
              throw new Error('Signer employee not found for assigned group');
            }
          } else if (assignedGroup.signerType === 'POSITION') {
            if (!assignedGroup.signerPositionId) {
              throw new Error('Missing signer position id');
            }
            if (
              !this.positions.find(
                (pos) => pos.id === assignedGroup.signerPositionId,
              )
            ) {
              throw new Error('Signer position not found for assigned group');
            }
          } else if (assignedGroup.signerType === 'DEPARTMENT') {
            if (!assignedGroup.signerDepartmentId) {
              throw new Error('Missing signer department id');
            }
            if (
              !this.departments.find(
                (dept) => dept.id === assignedGroup.signerDepartmentId,
              )
            ) {
              throw new Error('Signer department not found for assigned group');
            }
          } else if (assignedGroup.signerType === 'USER_LIST') {
            if (!assignedGroup.signerEmployeeList) {
              throw new Error('Missing signer employee list');
            }
            for (const emp of assignedGroup.signerEmployeeList) {
              if (!this.employees.find((e) => e.id === emp.id)) {
                throw new Error('Signer employee not found in list');
              }
            }
          }
        }
      }
      for (const formInstance of this.formInstances) {
        await this.upsertFormInstance(formInstance);
      }

      this.logSeededData();
      this.closeConnection();

      console.log('Seed operation completed successfully');
    } catch (error) {
      console.error('Error during seed operation:', error);
      await this.closeConnection();
      throw error;
    }
  }

  private async upsertPosition(data: PositionData) {
    const { id, name, departmentId } = data;

    return await this.prisma.position.upsert({
      where: { id },
      update: {},
      create: {
        id,
        name,
        departmentId,
      },
    });
  }

  private async upsertDepartment(data: DepartmentData) {
    const { id, name } = data;

    return await this.prisma.department.upsert({
      where: { id },
      update: {},
      create: {
        id,
        name,
      },
    });
  }

  private async upsertEmployee(data: EmployeeData) {
    const {
      id,
      firstName,
      lastName,
      email,
      signatureLink,
      positionId,
      scope,
      passwordHash,
    } = data;

    return await this.prisma.employee.upsert({
      where: { id: id },
      update: {},
      create: {
        id: id,
        firstName: firstName,
        lastName: lastName,
        email: email,
        signatureLink: signatureLink,
        positionId: positionId ?? undefined,
        scope: scope,
        isActive: true,
        pswdHash: passwordHash ?? undefined,
      },
    });
  }

  private async upsertFormTemplate(data: FormTemplateData) {
    const {
      id,
      name,
      formDocLink,
      description,
      fieldGroups,
      pageHeight,
      pageWidth,
      disabled,
    } = data;

    await this.prisma.formTemplate.upsert({
      where: { id },
      update: {},
      create: {
        id,
        name,
        formDocLink,
        description,
        pageHeight,
        pageWidth,
        fieldGroups: {
          create: fieldGroups.map((fieldGroup) => {
            return {
              id: fieldGroup.id,
              name: fieldGroup.name,
              order: fieldGroup.order,
              templateBoxes: {
                create: fieldGroup.templateBoxes.map((box) => {
                  return {
                    id: box.id,
                    type: box.type,
                    x_coordinate: box.x_coordinate,
                    y_coordinate: box.y_coordinate,
                    width: box.width,
                    height: box.height,
                    page: box.page,
                  };
                }),
              },
            };
          }),
        },
        disabled,
      },
    });
  }

  // Upsert a new form instance based on an existing form template
  private async upsertFormInstance(data: FormInstanceData) {
    const formTemplate = await this.prisma.formTemplate.findUnique({
      where: { id: data.formTemplateId },
      include: {
        fieldGroups: {
          include: {
            templateBoxes: true,
          },
        },
      },
    });

    if (!formTemplate) {
      throw new Error('Form template not found');
    }

    return await this.prisma.formInstance.upsert({
      where: { id: data.id },
      update: {},
      create: {
        id: data.id,
        name: data.name,
        formDocLink: data.formDocLink,
        description: data.description,
        originatorId: data.originatorId,
        formTemplateId: data.formTemplateId,
        assignedGroups: {
          create: data.assignedGroups.map((assignedGroup) => {
            return {
              id: assignedGroup.id,
              order: assignedGroup.order,
              signed: null,
              signerType: assignedGroup.signerType,
              signerEmployee: assignedGroup.signerEmployeeId
                ? {
                    connect: { id: assignedGroup.signerEmployeeId },
                  }
                : undefined,
              signerPosition: assignedGroup.signerPositionId
                ? {
                    connect: { id: assignedGroup.signerPositionId },
                  }
                : undefined,
              signerDepartment: assignedGroup.signerDepartmentId
                ? {
                    connect: { id: assignedGroup.signerDepartmentId },
                  }
                : undefined,
              signerEmployeeList: {
                connect: assignedGroup.signerEmployeeList?.map((dto) => ({
                  id: dto.id,
                })),
              },
              instanceBoxes: {
                create: formTemplate.fieldGroups
                  .find(
                    (fieldGroup) =>
                      fieldGroup.id === assignedGroup.fieldGroupId,
                  )
                  ?.templateBoxes.map((box) => {
                    return {
                      templateBoxId: box.id,
                    };
                  }),
              },
              fieldGroup: {
                connect: { id: assignedGroup.fieldGroupId },
              },
            };
          }),
        },
      },
      include: {
        assignedGroups: {
          include: {
            signerEmployee: true,
            signerDepartment: true,
            signerPosition: true,
            signerEmployeeList: true,
          },
        },
      },
    });
  }

  private async logSeededData() {
    const departments = await this.prisma.department.findMany();
    console.log('Departments:', departments);

    const allPositions = await this.prisma.position.findMany();
    console.log('Positions:', JSON.stringify(allPositions, null, 2));

    const allEmployees = await this.prisma.employee.findMany({
      include: {
        position: true,
      },
    });
    console.log('Employees:', allEmployees);

    const formTemplates = await this.prisma.formTemplate.findMany({
      include: {
        fieldGroups: {
          include: {
            templateBoxes: true,
          },
        },
      },
    });
    console.log('Form Templates:', formTemplates);

    const allFormInstances = await this.prisma.formInstance.findMany({
      include: {
        assignedGroups: {
          include: {
            signerEmployee: true,
            signerDepartment: true,
            signerPosition: true,
            signerEmployeeList: true,
            instanceBoxes: true,
          },
        },
      },
    });
    console.log('Form Instances:', allFormInstances);
  }

  async closeConnection() {
    await this.prisma.$disconnect();
  }
}
