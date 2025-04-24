import { FieldGroupBaseEntity, SignerType } from '@web/client';
import { ContextAssignedGroupData } from '@web/context/types';
import { ChakraStylesConfig, Select } from 'chakra-react-select';
import { Dispatch, SetStateAction, useEffect, useState } from 'react';
import { OptionType } from './types';

export type SignatureDropdownSelectProps<OptionType> = {
  assignedGroupData: ContextAssignedGroupData[];
  setAssignedGroupData: Dispatch<SetStateAction<ContextAssignedGroupData[]>>;
  fieldGroup: FieldGroupBaseEntity;
  options: OptionType[];
  activeTab: string;
  setActiveTab: Dispatch<SetStateAction<string>>;
  isMulti?: boolean;
};

export const SignatureDropdownSelect = <T extends object>(
  props: SignatureDropdownSelectProps<T>,
) => {
  const [selectedOptions, setSelectedOptions] = useState<OptionType[]>([]);
  const selectStyles: ChakraStylesConfig = {
    control: (provided) => ({
      ...provided,
      border: '1px solid #E5E5E5',
      boxShadow: 'none',
      minHeight: '40px',
      padding: '0px 8px',
    }),
    option: (provided, state) => ({
      ...provided,
      padding: '10px 12px',
      cursor: 'pointer',
    }),
    container: (provided) => ({
      ...provided,
      width: '100%',
      cursor: 'pointer',
    }),
    multiValue: (provided) => ({
      ...provided,
      padding: '6px',
    }),
  };

  const getSignerType = (tab: string, options: OptionType[]): SignerType => {
    switch (tab) {
      case 'Employee':
        return options.length === 1 ? SignerType.USER : SignerType.USER_LIST;
      case 'Role':
        return SignerType.POSITION;
      case 'Department':
        return SignerType.DEPARTMENT;
      default:
        return SignerType.USER;
    }
  };

  // prefill dropdown if assigned group exists
  useEffect(() => {
    const assignedGroup = props.assignedGroupData.find(
      (group) => group.fieldGroupId === props.fieldGroup.id,
    );

    if (!assignedGroup) return;

    const signerType = assignedGroup.signerType;

    switch (signerType) {
      case SignerType.USER:
        props.setActiveTab('Employee');
        setSelectedOptions([
          {
            value: assignedGroup.signerEmployeeId!,
            label: assignedGroup.name,
          },
        ]);
        break;
      case SignerType.POSITION:
        props.setActiveTab('Role');
        setSelectedOptions([
          {
            value: assignedGroup.signerPositionId!,
            label: assignedGroup.name,
          },
        ]);
        break;
      case SignerType.DEPARTMENT:
        props.setActiveTab('Department');
        setSelectedOptions([
          {
            value: assignedGroup.signerDepartmentId!,
            label: assignedGroup.name,
          },
        ]);
        break;
      case SignerType.USER_LIST:
        props.setActiveTab('Employee');
        setSelectedOptions(
          assignedGroup.signerEmployeeList.map((employee) => ({
            value: employee.id,
            label: employee.id,
          })),
        );
        break;
    }
  }, [props.fieldGroup.id]);

  useEffect(() => {
    setSelectedOptions([]);
  }, [props.activeTab]);

  return (
    <Select
      isMulti={props.isMulti}
      useBasicStyles
      selectedOptionStyle="check"
      options={props.options}
      onChange={(selected: OptionType[]) => {
        setSelectedOptions(selected);

        // create assigned group object
        const assignedGroup: ContextAssignedGroupData = {
          name: selected.map((o) => o.label).join(', '),
          order: props.fieldGroup.order,
          fieldGroupId: props.fieldGroup.id,
          signerType: getSignerType(props.activeTab, selected),
          signerEmployeeList: [],
        };

        if (selected.length === 1) {
          assignedGroup[
            props.activeTab === 'Employee'
              ? 'signerEmployeeId'
              : props.activeTab === 'Role'
              ? 'signerPositionId'
              : 'signerDepartmentId'
          ] = selected[0].value;
        } else {
          if (props.activeTab === 'Employee') {
            assignedGroup.signerEmployeeList = selected.map((o) => ({
              id: o.value,
              name: o.label,
            }));
          }
        }

        // if the group id already exists, update it
        const existingIndex = props.assignedGroupData.findIndex(
          (group) => group.fieldGroupId === props.fieldGroup.id,
        );
        if (existingIndex !== -1) {
          const newAssignedGroupData = [...props.assignedGroupData];
          newAssignedGroupData[existingIndex] = assignedGroup;
          props.setAssignedGroupData(newAssignedGroupData);
        } else {
          // otherwise, add it to the list
          props.setAssignedGroupData([
            ...props.assignedGroupData,
            assignedGroup,
          ]);
        }
      }}
      value={selectedOptions}
      chakraStyles={selectStyles}
    />
  );
};
