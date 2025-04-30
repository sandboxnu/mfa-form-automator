export enum SortOption {
  CREATED_AT_ASC = 'createdAtAsc',
  CREATED_AT_DESC = 'createdAtDesc',
  UPDATED_AT_ASC = 'updatedAtAsc',
  UPDATED_AT_DESC = 'updatedAtDesc',
  NAME_ASC = 'nameAsc',
  NAME_DESC = 'nameDesc',
}

export const orderBy = (sortBy?: SortOption) => {
  switch (sortBy) {
    case SortOption.CREATED_AT_ASC:
      return { createdAt: 'asc' as const };
    case SortOption.CREATED_AT_DESC:
      return { createdAt: 'desc' as const };
    case SortOption.UPDATED_AT_ASC:
      return { updatedAt: 'asc' as const };
    case SortOption.UPDATED_AT_DESC:
      return { updatedAt: 'desc' as const };
    case SortOption.NAME_ASC:
      return { name: 'asc' as const };
    case SortOption.NAME_DESC:
      return { name: 'desc' as const };
    default:
      return { createdAt: 'desc' as const }; // Default sorting
  }
};
