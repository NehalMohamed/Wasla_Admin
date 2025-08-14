import React, { useState } from "react";
import { Accordion, Table } from "react-bootstrap";
import { format } from "date-fns";
function SummaryInvoice({ data }) {
  const getStatusText = (status) => {
    switch (status) {
      case 1:
        return "Pending";
      case 2:
        return "Checkout";
      case 3:
        return "paid";
      default:
        return "pending";
    }
  };

  return (
    <>
      {data && data.length > 0
        ? data.map((row, index) => (
            <Accordion key={index} defaultActiveKey={index}>
              <Accordion.Item eventKey={index}>
                <Accordion.Header>{row.currency_code}</Accordion.Header>
                <Accordion.Body>
                  <Table>
                    <thead>
                      <tr>
                        <th>Invoice No.</th>
                        <th>Date</th>
                        <th>Client</th>
                        <th>Status</th>
                        <th>Net Value</th>
                        <th>Discount</th>
                        <th>VAT</th>
                        <th>Total Amount</th>
                      </tr>
                    </thead>
                    <tbody>
                      {row.invoices &&
                        row.invoices.map((invoice, key) => (
                          <tr key={key}>
                            <td>{invoice.invoice_code}</td>
                            <td>
                              {format(invoice.invoice_date, "dd-MM-yyyy")}
                            </td>
                            <td>{invoice.client_name}</td>
                            <td>{getStatusText(invoice.status)}</td>
                            <td>{invoice.total_price}</td>
                            <td>{invoice.copoun_discount_value}</td>
                            <td>{invoice.tax_amount}</td>
                            <td>{invoice.grand_total_price}</td>
                          </tr>
                        ))}
                      <tr>
                        <th colSpan={4} className="total_price_th">
                          Grand Total
                        </th>
                        <th className="total_price_th">{row.netValTotal}</th>
                        <th className="total_price_th">
                          {row.grandTotalDiscount}
                        </th>
                        <th className="total_price_th">{row.grandTotalVat}</th>
                        <th className="total_price_th">
                          {row.grandTotalAmount}
                        </th>
                      </tr>
                    </tbody>
                  </Table>
                </Accordion.Body>
              </Accordion.Item>
            </Accordion>
          ))
        : null}
    </>
  );
}

export default SummaryInvoice;
