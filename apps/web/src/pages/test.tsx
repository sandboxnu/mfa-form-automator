import { AssignInput } from '@web/components/createFormTemplate/AssignInput';
import dynamic from 'next/dynamic';

// const AssignInput = dynamic(
//   () =>
//     import('../components/createFormTemplate/AssignInput.tsx').then(
//       (mod) => mod.AssignInput,
//     ),
//   { ssr: false },
// );
export default function Test() {
  return (
    <>
      <AssignInput></AssignInput>
    </>
  );
}
