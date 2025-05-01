import { FieldGroupBaseEntity, SignerType } from '@web/client';
import { ContextAssignedGroupData } from '@web/context/types';
import { ChakraStylesConfig, Select } from 'chakra-react-select';
import { Dispatch, SetStateAction, useEffect, useState } from 'react';
import { OptionType } from './types';

export type SignatureDropdownSelectProps = {
  assignedGroupData: any[];
  setAssignedGroupData: Dispatch<SetStateAction<any[]>>;
  fieldGroup: FieldGroupBaseEntity;
  options: OptionType[];
  activeTab: string;
  setActiveTab: Dispatch<SetStateAction<string>>;
  isMulti?: boolean;
};

export const SignatureDropdownSelect = ({
  assignedGroupData,
  setAssignedGroupData,
  fieldGroup,
  options,
  activeTab,
  setActiveTab,
  isMulti = false,
}: SignatureDropdownSelectProps) => {
  const [selectedOptions, setSelectedOptions] = useState<OptionType[]>([]);

  const selectStyles: ChakraStylesConfig = {
    control: (provided) => ({
      ...provided,
      border: '1px solid #E5E5E5',
      boxShadow: 'none',
      minHeight: '40px',
      padding: '0px 8px',
    }),
    option: (provided) => ({
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

  const getSignerType = (
    tab: string,
    selectedOpts: OptionType[],
  ): SignerType => {
    switch (tab) {
      case 'Employee':
        return selectedOpts.length === 1
          ? SignerType.USER
          : SignerType.USER_LIST;
      case 'Role':
        return SignerType.POSITION;
      case 'Department':
        return SignerType.DEPARTMENT;
      default:
        return SignerType.USER;
    }
  };

  // Effect to prefill dropdown if assigned group exists
  useEffect(() => {
    const assignedGroup = assignedGroupData.find(
      (group) => group.fieldGroupId === fieldGroup.id,
    );

    if (!assignedGroup) {
      setSelectedOptions([]);
      return;
    }

    const signerType = assignedGroup.signerType;

    switch (signerType) {
      case SignerType.USER:
        setActiveTab('Employee');
        if (assignedGroup.signerEmployeeId) {
          setSelectedOptions([
            {
              value: assignedGroup.signerEmployeeId,
              label: assignedGroup.name,
            },
          ]);
        }
        break;
      case SignerType.POSITION:
        setActiveTab('Role');
        if (assignedGroup.signerPositionId) {
          setSelectedOptions([
            {
              value: assignedGroup.signerPositionId,
              label: assignedGroup.name,
            },
          ]);
        }
        break;
      case SignerType.DEPARTMENT:
        setActiveTab('Department');
        if (assignedGroup.signerDepartmentId) {
          setSelectedOptions([
            {
              value: assignedGroup.signerDepartmentId,
              label: assignedGroup.name,
            },
          ]);
        }
        break;
      case SignerType.USER_LIST:
        setActiveTab('Employee');
        if (
          assignedGroup.signerEmployeeList &&
          assignedGroup.signerEmployeeList.length > 0
        ) {
          setSelectedOptions(
            assignedGroup.signerEmployeeList.map(
              (employee: { id: string; name: string }) => ({
                value: employee.id,
                label: employee.name,
              }),
            ),
          );
        }
        break;
    }
  }, [assignedGroupData, fieldGroup.id, setActiveTab]);

  // Reset selected options when tab changes
  useEffect(() => {
    setSelectedOptions([]);
  }, [activeTab]);

  const handleSelectChange = (selected: any) => {
    const selectedArray = Array.isArray(selected) ? selected : [selected];
    setSelectedOptions(selectedArray);

    if (!selectedArray.length) {
      // Remove assignment if nothing is selected
      setAssignedGroupData((prev) =>
        prev.filter((group) => group.fieldGroupId !== fieldGroup.id),
      );
      return;
    }

    // Create assigned group object
    const assignedGroup: ContextAssignedGroupData = {
      name: selectedArray.map((o) => o.label).join(', '),
      order: fieldGroup.order,
      fieldGroupId: fieldGroup.id,
      signerType: getSignerType(activeTab, selectedArray),
      signerEmployeeList: [],
    };

    if (selectedArray.length === 1) {
      // Single selection
      if (activeTab === 'Employee') {
        assignedGroup.signerEmployeeId = selectedArray[0].value;
      } else if (activeTab === 'Role') {
        assignedGroup.signerPositionId = selectedArray[0].value;
      } else if (activeTab === 'Department') {
        assignedGroup.signerDepartmentId = selectedArray[0].value;
      }
    } else if (activeTab === 'Employee') {
      // Multiple employee selection
      assignedGroup.signerEmployeeList = selectedArray.map((o) => ({
        id: o.value,
        name: o.label,
      }));
    }

    // If the group id already exists, update it
    const existingIndex = assignedGroupData.findIndex(
      (group) => group.fieldGroupId === fieldGroup.id,
    );

    if (existingIndex !== -1) {
      const newAssignedGroupData = [...assignedGroupData];
      newAssignedGroupData[existingIndex] = assignedGroup;
      setAssignedGroupData(newAssignedGroupData);
    } else {
      // Otherwise, add it to the list
      setAssignedGroupData((prev) => [...prev, assignedGroup]);
    }
  };

  return (
    <Select
      isMulti={isMulti}
      useBasicStyles
      selectedOptionStyle="check"
      options={options}
      onChange={handleSelectChange}
      value={selectedOptions}
      chakraStyles={selectStyles}
    />
  );
};
