import React from "react";
import { Accordion, Table } from "react-bootstrap";
function SummaryService({ data }) {
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
                        <th>Service</th>
                        <th>Net Value</th>
                        <th>Discount</th>
                        <th>VAT</th>
                        <th>Total Amount</th>
                      </tr>
                    </thead>
                    <tbody>
                      {row.result &&
                        row.result.map((invoice, key) => (
                          <tr key={key}>
                            <td>{invoice.service_name}</td>

                            <td>{invoice.netValTotal}</td>
                            <td>{invoice.grandTotalDiscount}</td>
                            <td>{invoice.grandTotalVat}</td>
                            <td>{invoice.grandTotalAmount}</td>
                          </tr>
                        ))}
                      {/* <tr>
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
                      </tr> */}
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

export default SummaryService;
