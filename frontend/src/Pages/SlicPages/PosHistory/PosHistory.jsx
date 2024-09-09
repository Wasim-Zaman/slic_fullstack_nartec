import React, { useEffect, useState } from "react";
import SideNav from "../../../components/Sidebar/SideNav";
import { useNavigate } from "react-router-dom";
import { posHistoryInvoiceColumns } from "../../../utils/datatablesource";
import DataTable from "../../../components/Datatable/Datatable";
import newRequest from "../../../utils/userRequest";
import { toast } from "react-toastify";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import { Autocomplete, Button, CircularProgress, TextField } from "@mui/material";

const PosHistory = () => {
  const [data, setData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [secondGridData, setSecondGridData] = useState([]);
  const [filteredData, setFilteredData] = useState([]); // for the map markers
  const [loading, setLoading] = useState(false);
  const [transactionCodes, setTransactionCodes] = useState([]);
  const [selectedTransactionCode, setSelectedTransactionCode] = useState("");
  const [filteredTransactionCodesData, setFilteredTransactionCodesData] = useState([]);
  const [invoiceList, setInvoiceList] = useState([]);
  const [selectedInvoice, setSelectedInvoice] = useState([]);
  const [dateFrom, setDateFrom] = useState(""); // Date from
  const [dateTo, setDateTo] = useState(""); // Date to
  const navigate = useNavigate();
  const [isPurchaseOrderDataLoading, setIsPurchaseOrderDataLoading] =
    useState(false);



    
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const response = await newRequest.get("/Invoice/v1/masters");
        // console.log(response?.data?.data);
        setData(response?.data?.data || []);


        const transactionData = response?.data?.data || [];
        // Extracting only unique TransactionCodes
        const codes = [...new Set(transactionData.map((item) => item.TransactionCode))];
        const customerCodes = [...new Set(transactionData.map((item) => item.CustomerCode))];
        
        setTransactionCodes(codes);
        setInvoiceList(customerCodes); // Set customer codes to display in the dropdown
        setFilteredTransactionCodesData(transactionData);

      setIsLoading(false);
    } catch (err) {
      setIsLoading(false);
      toast.error(err?.response?.data?.message || "Something went Wrong");
    }
  };
  
  useEffect(() => {
    fetchData(); // Calling the function within useEffect, not inside itself
  }, []);


  
  const handleRowClickInParent = async (item) => {
    // console.log(item)
    // if (item.length === 0) {
    //   setFilteredData(secondGridData);
    //   return;
    // }
    
    // // call api
    // setIsPurchaseOrderDataLoading(true);
    // try {
    //   const res = await newRequest.get(
    //     `/Invoice/v1/detailsByInvoiceNo?InvoiceNo=${item[0].InvoiceNo}`
    //   );
    //   // console.log(res?.data?.data);

    //   setFilteredData(res?.data?.data || []);
    // } catch (err) {
    //   console.log(err);
    //   toast.error(
    //     err?.response?.data?.error ||
    //       err?.response?.data?.message ||
    //       "Something went wrong"
    //     );
    //     setFilteredData([]);
    // } finally {
    //   setIsPurchaseOrderDataLoading(false);
    // }
  };
  

  const handleTransactionCodes = (event, value) => {
    setSelectedTransactionCode(value ? value : "");
    applyFilters(value, selectedInvoice);
  };

  const handleSelectAllInvoice = (event, value) => {
    setSelectedInvoice(value);
    applyFilters(selectedTransactionCode, value);
  };


  // Apply filters based on selected transaction codes and customer codes
  const applyFilters = (transactionCode, customerCodes) => {
    let filtered = data;

    // Apply TransactionCode filter
    if (transactionCode) {
      filtered = filtered.filter(item => item.TransactionCode === transactionCode);
    }

    // Apply CustomerCodes filter (if multiple are selected)
    if (customerCodes && customerCodes.length > 0) {
      filtered = filtered.filter(item => customerCodes.includes(item.CustomerCode));
    }

    setFilteredTransactionCodesData(filtered);
  };
  
  
  // Handle date filtering when "Generate" button is clicked
  const handleDateFilter = () => {
    if (!dateFrom && !dateTo) {
      setFilteredTransactionCodesData(data); // Reset to full data
      return;
    }

    const fromDate = new Date(dateFrom);
    const toDate = new Date(dateTo);
    
    const filteredByDate = data.filter(item => {
      const transactionDate = new Date(item.TransactionDate);
      return transactionDate >= fromDate && transactionDate <= toDate;
    });
    
    setFilteredTransactionCodesData(filteredByDate);
  };
  
  useEffect(() => {
    if (!dateFrom || !dateTo) {
      setFilteredTransactionCodesData(data); // Reset to full data if either date is cleared
    }
  }, [dateFrom, dateTo, data]);


  return (
    <SideNav>
      <div className="p-3 h-full">
        <div className="flex justify-center items-center">
          <div className="h-auto w-full">
            <div className="h-auto w-full bg-white shadow-xl rounded-md">
              <div className="sm:flex p-4 gap-2 w-full">
                <div className="flex flex-col w-full">
                  <label className='font-sans font-semibold text-sm text-secondary'>DATE FROM</label>
                  <input
                    value={dateFrom}
                    onChange={(e) => setDateFrom(e.target.value)}
                    type="date"
                    className="border border-gray-300 p-2 rounded-lg"
                  />
                </div>
                <div className="flex flex-col w-full">
                  <label className='font-sans font-semibold text-sm text-secondary'>DATE TO</label>
                  <input
                    value={dateTo}
                    onChange={(e) => setDateTo(e.target.value)}
                    type="date"
                    className="border border-gray-300 p-2 rounded-lg"
                  />
                </div>

                <div className="flex justify-center items-center w-[30%] mt-4">
                  <Button
                    variant="contained"
                    style={{ backgroundColor: "#021F69", color: "#ffffff" }}
                    disabled={loading}
                    className="w-full"
                    endIcon={
                      loading ? (
                        <CircularProgress size={24} color="inherit" />
                      ) : null
                    }
                    onClick={handleDateFilter}
                  >
                    Generate
                  </Button>
                </div>
              </div>

              <div className="sm:flex p-4 gap-2 w-full">
                <div className="flex flex-col w-full">
                  <label className='font-sans font-semibold text-sm text-secondary'>Transaction Codes</label>
                  <Autocomplete
                    id="transactionId"
                    options={transactionCodes}
                    getOptionLabel={(option) => option || ''}  // Display only TransactionCode
                    onChange={handleTransactionCodes}
                    value={selectedTransactionCode || null}
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        className="bg-gray-50 border border-gray-300 text-black text-xs rounded-sm"
                        placeholder="Select any Transaction Code"
                        required
                      />
                    )}
                  />
                </div>

                <div className="flex flex-col w-full">
                  <label className='font-sans font-semibold text-sm text-secondary'>Customer Codes</label>
                  <Autocomplete
                    multiple
                    id="customerCodeId"
                    options={invoiceList}
                    getOptionLabel={(option) => option || ''}  // Display only TransactionCode
                    onChange={handleSelectAllInvoice}
                    value={selectedInvoice}
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        className="bg-gray-50 border border-gray-300 text-black text-xs rounded-sm"
                        placeholder="Select any Customer Code"
                        required
                      />
                    )}
                  />
                </div>

                <div className="flex justify-center items-center w-[30%] mt-4">
                  {/* <Button
                    variant="contained"
                    style={{ backgroundColor: "#021F69", color: "#ffffff" }}
                    disabled={loading}
                    className="w-full"
                    endIcon={
                      loading ? (
                        <CircularProgress size={24} color="inherit" />
                      ) : null
                    }
                  >
                    Search 
                  </Button> */}
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="h-auto w-full shadow-xl">
          <div
            style={{
              marginLeft: "-11px",
              marginRight: "-11px",
            }}
          >
            <DataTable
              data={filteredTransactionCodesData}
              title={"POS History"}
              columnsName={posHistoryInvoiceColumns}
              loading={isLoading}
              secondaryColor="secondary"
              checkboxSelection="disabled"
              handleRowClickInParent={handleRowClickInParent}
              globalSearch={true}
              actionColumnVisibility={false}
              dropDownOptions={[
                {
                  label: "Edit",
                  icon: (
                    <EditIcon
                      fontSize="small"
                      color="action"
                      style={{ color: "rgb(37 99 235)" }}
                    />
                  ),
                  //   action: handleShowUpdatePopup,
                },
                {
                  label: "Delete",
                  icon: (
                    <DeleteIcon
                      fontSize="small"
                      color="action"
                      style={{ color: "rgb(37 99 235)" }}
                    />
                  ),
                  //   action: handleDelete,
                },
              ]}
              uniqueId="posHistoryId"
            />
          </div>
        </div>

        {/* <div style={{ marginLeft: "-11px", marginRight: "-11px" }}>
          <DataTable
            data={filteredData}
            title={"POS History Details"}
            secondaryColor="secondary"
            columnsName={posHistoryInvoiceColumns}
            backButton={true}
            checkboxSelection="disabled"
            actionColumnVisibility={false}
            // dropDownOptions={[
            //   {
            //     label: "Delete",
            //     icon: <DeleteIcon fontSize="small" style={{ color: '#FF0032' }} />
            //     ,
            //     action: handleShipmentDelete,
            //   },
            // ]}
            uniqueId={"posHistoryDetailsId"}
            loading={isPurchaseOrderDataLoading}
          />
        </div> */}
      </div>
    </SideNav>
  );
};

export default PosHistory;
