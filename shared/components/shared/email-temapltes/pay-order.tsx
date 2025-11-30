//shared/components/shared/email-temapltes/pay-order.tsx
import React from 'react';

export interface Props {
  orderId: number;
  totalAmount: number;
  paymentUrl: string;
  city: string;
}

export const PayOrderTemplate: React.FC<Props> = ({ orderId, totalAmount, paymentUrl, city }) => (
  <div>
    <h1>Заказ #{orderId}</h1>

    <p>
      Оплатите заказ на сумму <b>{totalAmount} ₽</b>. Перейдите{' '}
      <a href={paymentUrl}>по этой ссылке</a> для оплаты заказа. Город доставки: {city}
    </p>
  </div>
);
