'use server';

import { assertStaff } from '@/lib/auth';
import { uploadOrderProof } from '@/actions/admin/orders';

export async function addOrderProof(orderId: string, formData: FormData) {
  await assertStaff();
  formData.set('orderId', orderId);
  return uploadOrderProof(formData);
}
