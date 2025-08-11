import React, { useEffect, useState } from "react";
import {
  FaEdit,
  FaSearch,
  FaCheck,
  FaTimes,
  FaChevronUp,
  FaChevronDown,
} from "react-icons/fa";
import { Table, Pagination } from "react-bootstrap";
import { useSelector, useDispatch } from "react-redux";
import { GetAudit_Logs } from "../../slices/LogSlice";
import "./Transaction.scss";
function Transaction() {
  const dispatch = useDispatch();
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const { Data, loading, error } = useSelector((state) => state.transactions);
  useEffect(() => {
    let req = { pageNumber: currentPage, pageSize: itemsPerPage };
    dispatch(GetAudit_Logs(req));
    return () => {};
  }, []);

  useEffect(() => {
    const totalPages = Math.ceil(Data?.totalPages / itemsPerPage);
    setTotalPages(totalPages);

    return () => {};
  }, [Data]);

  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
      let req = { pageNumber: page, pageSize: itemsPerPage };
      dispatch(GetAudit_Logs(req));
    }
  };
  return (
    <>
      <div className="d-flex justify-content-between align-items-center">
        <h2 className="mb-4 page-title">Data Transactions</h2>
        <div className="d-flex align-items-center"></div>
        <div className="mb-4 position-relative" style={{ width: "250px" }}>
          <FaSearch
            className="position-absolute"
            style={{
              left: "10px",
              top: "50%",
              transform: "translateY(-50%)",
              color: "#888",
            }}
          />
          <input
            type="text"
            className="form-control ps-6"
            placeholder="Search By Operation ..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{ paddingLeft: "30px" }}
          />
        </div>
      </div>
      <div className="result_list">
        <Table responsive hover>
          <thead>
            <tr>
              <th>Schema Name</th>
              <th>Table Name</th>
              <th>Operation</th>
              <th>Record Id</th>
              <th>Changed At</th>
            </tr>
          </thead>
          <tbody>
            {Data && Data.result && Data.result.length > 0 ? (
              Data.result
                .filter((item) =>
                  item.operation
                    .toLowerCase()
                    .includes(searchTerm.toLowerCase())
                )
                .map((invoice, key) => (
                  <tr key={key}>
                    <td>{invoice.schema_name}</td>
                    <td>{invoice.table_name}</td>
                    <td>{invoice.operation}</td>
                    <td>{invoice.record_pk}</td>
                    <td>{invoice.changed_atStr}</td>
                  </tr>
                ))
            ) : (
              <tr>
                <td colspan="5">No Data</td>
              </tr>
            )}
          </tbody>
        </Table>
        {/* Pagination */}
        <Pagination className="mt-3 justify-content-center">
          <Pagination.Prev
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
          />
          {Array.from({ length: totalPages }, (_, i) => (
            <Pagination.Item
              key={i}
              active={i + 1 === currentPage}
              onClick={() => handlePageChange(i + 1)}
            >
              {i + 1}
            </Pagination.Item>
          ))}
          <Pagination.Next
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
          />
        </Pagination>
      </div>
    </>
  );
}

export default Transaction;
