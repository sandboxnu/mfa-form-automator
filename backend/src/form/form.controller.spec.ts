import { Test } from '@nestjs/testing';
import { Form } from 'src/models/form.entity';
import { FormController } from './form.controller';
import { FormDto } from './form.dto';
import { FormService } from './form.service';

describe('FormsController', () => {
  let formController: FormController;
  let formService: FormService;

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      controllers: [FormController],
      providers: [FormService],
    }).compile();

    formController = moduleRef.get<FormController>(FormController);
    formService = moduleRef.get<FormService>(FormService);
  });

  describe('CreateForm', () => {
    it('Should return a valid link', async () => {
      const resLink = 'https://sandboxnu.com';
      // jest.spyOn(formService, 'createForm').mockImplementation(() => resLink);
    });
  });
});
