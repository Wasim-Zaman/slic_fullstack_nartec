import React, { useEffect, useRef, useState } from "react";
import Button from "@mui/material/Button";
import CircularProgress from "@mui/material/CircularProgress";
import { toast } from "react-toastify";
import ErpTeamRequest from "../../../utils/ErpTeamRequest";

const F3TenderCashPopUp = ({
  isVisible,
  setVisibility,
  storeDatagridData,
  showOtpPopup,
  handleClearData,
  selectedSalesType,
  handleInvoiceGenerator,
  totalAmountWithVat,
  invoiceHeaderData,
  handleClearInvoiceData,
  mobileNo,
  customerName,
  remarks,
  selectedCustomerCode,
  selectedTransactionCode,
}) => {
  const [loading, setLoading] = useState(false);
  const [isPrintEnabled, setIsPrintEnabled] = useState(false);
  const [cashAmount, setCashAmount] = useState('');
  const [changeAmount, setChangeAmount] = useState('');
  const [bankApprovedCode, setBankApprovedCode] = useState('');
  const grossAmount = totalAmountWithVat;

  const handleCloseCreatePopup = () => {
    setVisibility(false);
  };

  const [selectedCompany, setSelectedCompany] = useState(null);
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [token, setToken] = useState(null);
  const PaymentModels = sessionStorage.getItem("selectedPaymentModels");
  const paymentModes = JSON.parse(PaymentModels);
  const ExamptionReason = sessionStorage.getItem("selectedExamptionReason");
  const examptReason = JSON.parse(ExamptionReason);

  useEffect(() => {
    // slic login api token get
    const token = JSON.parse(sessionStorage.getItem("slicLoginToken"));
    setToken(token);

    const storedCompanyData = sessionStorage.getItem("selectedCompany");
    if (storedCompanyData) {
      const companyData = JSON.parse(storedCompanyData);
      if (JSON.stringify(companyData) !== JSON.stringify(selectedCompany)) {
        setSelectedCompany(companyData);
        // console.log(companyData);
      }
    }

    const storedLocationData = sessionStorage.getItem("selectedLocation");
    if (storedLocationData) {
      const locationData = JSON.parse(storedLocationData);
      if (JSON.stringify(locationData) !== JSON.stringify(selectedLocation)) {
        setSelectedLocation(locationData);
        // console.log(locationData);
      }
    }
  }, []);

  useEffect(() => {
    if (isVisible) {
      console.log("Popup Data:", storeDatagridData);
      // console.log(selectedCustomerCode)
      // console.log(selectedTransactionCode)
    }
  }, [isVisible, storeDatagridData]);

  useEffect(() => {
    // Calculate change whenever cashAmount or grossAmount changes
    const calculatedChange = cashAmount - grossAmount;
    setChangeAmount(calculatedChange > 0 ? calculatedChange : 0);
  }, [cashAmount, grossAmount]);


  // I call bank Api For Both Reasons 
  const callBankReceiptAPI = async (documentNo, transactionCode, customerCode) => {
    const bankReceiptBody = {
      _keyword_: "BANKRCPTEX",
      "_secret-key_": "2bf52be7-9f68-4d52-9523-53f7f267153b",
      data: [
        {
          Company: "SLIC",
          UserId: "SYSADMIN",
          Department: "011",
          TransactionCode: "BRV",
          Division: "100",
          BankApproverCode: bankApprovedCode,
          CashCardFlag: "CARD",
          ReceiptAmt: grossAmount,
          CustomerId: customerCode,
          MatchingTransactions: [
            {
              DocNo: documentNo,
              TransactionCode: transactionCode,
              PendingAmount: changeAmount,
              AdjAmount: "",     
            },
          ],
        },
      ],
      COMPANY: "SLIC",
      USERID: "SYSADMIN",
      APICODE: "BANKRECEIPTVOUCHER",
      LANG: "ENG",
    };

    const bankRes = await ErpTeamRequest.post(
      "/slicuat05api/v1/postData",
      bankReceiptBody,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    console.log(bankRes?.data);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!cashAmount) {
      toast.error(`Please type the ${paymentModes.name} Amount`);
      return;
    }

    setLoading(true);
    try {
      const items = storeDatagridData.map((item) => {
        const rate = `${item?.ItemPrice}`;

        const commonFields = {
          "Item-Code": item.SKU,
          Size: item.ItemSize,
          Qty: `${item.Qty}`,
          UserId: "SYSADMIN",
        };

        return selectedSalesType === "DIRECT SALES INVOICE"
          ? { ...commonFields, Rate: rate }
          : commonFields;
      });

      // Constructing the body based on the selectedSalesType
      const body =
        selectedSalesType === "DIRECT SALES INVOICE"
          ? {
              _keyword_: "Invoice",
              "_secret-key_": "2bf52be7-9f68-4d52-9523-53f7f267153b",
              data: [
                {
                  "Company": "SLIC",
                  "TransactionCode": selectedTransactionCode?.TXN_CODE,
                  "CustomerCode": selectedCustomerCode?.CUST_CODE,
                  "SalesLocationCode": selectedLocation?.LOCN_CODE,
                  "DeliveryLocationCode": selectedLocation?.LOCN_CODE,
                  "UserId": "SYSADMIN",
                  "CustomerName": customerName,
                  "MobileNo": mobileNo,
                  "Remarks": remarks,
                  "PosRefNo": 12, 
                  "ZATCAPaymentMode": paymentModes.code,  
                  "TaxExemptionReason":"",       
                  Item: items,
                },
              ],
              COMPANY: "SLIC",
              USERID: "SYSADMIN",
              APICODE: "INVOICE",
              LANG: "ENG",
            }
          : {
              keyword: "salesreturn",
              "secret-key": "2bf52be7-9f68-4d52-9523-53f7f267153b",
              data: [
                {
                  Company: "SLIC",
                  TransactionCode: invoiceHeaderData?.TransactionCode,
                  CustomerCode: invoiceHeaderData?.CustomerCode,
                  SalesLocationCode: selectedLocation?.LOCN_CODE || "FG101",
                  DeliveryLocationCode: selectedLocation?.LOCN_CODE || "FG101",
                  UserId: "SYSADMIN",
                  CustomerName: invoiceHeaderData?.CustomerCode,
                  MobileNo: invoiceHeaderData?.MobileNo,
                  Remarks: invoiceHeaderData?.Remarks,
                  PosRefNo: 12,
                  ZATCAPaymentMode: paymentModes.code,
                  TaxExemptionReason: "1",
                  Item: items,
                },
              ],
              COMPANY: "SLIC",
              USERID: "SYSADMIN",
              APICODE: "SALESRETURN",
              LANG: "ENG",
            };

      // API call based on the constructed body
      const res = await ErpTeamRequest.post("/slicuat05api/v1/postData", body, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      console.log(res?.data);
      showOtpPopup(res?.data);

      // Call the bank receipt API if the payment type is 4 or 5
      if (paymentModes.code === "4" || paymentModes.code === "5") {
        const documentNo = res?.data?.DocumentNo;
        const transactionCode = selectedSalesType === "DIRECT SALES INVOICE"
          ? selectedTransactionCode?.TXN_CODE
          : invoiceHeaderData?.TransactionCode;
        const customerCode = selectedSalesType === "DIRECT SALES INVOICE"
          ? selectedCustomerCode?.CUST_CODE
          : invoiceHeaderData?.CustomerCode;

        await callBankReceiptAPI(documentNo, transactionCode, customerCode);
      }

      handleCloseCreatePopup();
      handleClearData();
      handleClearInvoiceData();
      handleInvoiceGenerator();
      setLoading(false);
    } catch (err) {
      toast.error(err?.response?.data?.message || "Something went wrong");
      setLoading(false);
    }
  };

  // useEffect(() => {
  //   if(PaymentModels) {
  //     console.log(paymentModes);
  //   }
  // }, [PaymentModels]);

  // useEffect(() => {
  //   if(ExamptionReason) {
  //     console.log(examptReason);
  //   }
  // }, [ExamptionReason]);

  // useEffect(() => {
  //   if (invoiceHeaderData) {
  //     console.log(invoiceHeaderData)
  //   }
  // }, [invoiceHeaderData]);

  return (
    <div>
      {isVisible && (
        <div className="popup-overlay z-50 fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="popup-container bg-white rounded-lg shadow-lg h-auto sm:w-[50%] w-full">
            <div
              className="popup-form w-full"
              style={{ maxHeight: "90vh", overflowY: "auto" }}
            >
              <div className="relative">
                <div className="fixed top-0 left-0 z-10 flex justify-between w-full px-3 bg-secondary">
                  <h2 className="text-white sm:text-xl text-lg font-body font-semibold">
                    F3 Tender Cash - {selectedSalesType}
                  </h2>
                  <div className="flex items-center space-x-3">
                    <button
                      className="text-white hover:text-gray-300 focus:outline-none"
                      onClick={handleCloseCreatePopup}
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-6 w-6"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M20 14H4"
                        />
                      </svg>
                    </button>
                    <button
                      className="text-white hover:text-gray-300 focus:outline-none"
                      onClick={handleCloseCreatePopup}
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-6 w-6"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M4 4h16v16H4z"
                        />
                      </svg>
                    </button>
                    <button
                      className="text-white hover:text-red-600 focus:outline-none"
                      onClick={handleCloseCreatePopup}
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-6 w-6"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M6 18L18 6M6 6l12 12"
                        />
                      </svg>
                    </button>
                  </div>
                </div>
              </div>
              <div className="p-0 w-full">
                <div className="grid grid-cols-2 gap-4">
                  {/* Invoice Form */}
                  <form onSubmit={handleSubmit} className="border p-4 w-full">
                    <div className="border border-gray-300 rounded-lg p-2 bg-gray-50 overflow-x-auto">
                      <div className="min-w-[300px] min-h-[100px]">
                        {/* Header */}
                        <div className="grid grid-cols-3 gap-2 bg-gray-200 p-2 rounded-t-lg">
                          <p className="text-sm">Item Code</p>
                          <p className="text-sm">Size</p>
                          <p className="text-sm">Item Price</p>
                        </div>

                        {storeDatagridData.map((item, index) => (
                          <div
                            key={index}
                            className="grid grid-cols-3 gap-2 border-t border-gray-300 p-2"
                          >
                            <p className="text-sm">{item.SKU}</p>
                            <p className="text-sm">{item.ItemSize}</p>
                            <p className="text-sm">{item.ItemPrice}</p>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Gross Amount Display */}
                    <div className="mt-4">
                      <p className="text-sm font-sans text-red-500">
                        Gross Amount with 15% VAT: SAR {grossAmount}
                      </p>
                    </div>
                    <div className="mt-10">
                      <Button
                        variant="contained"
                        style={{
                          backgroundColor: "#021F69", // Change color based on enabled/disabled state
                          //   backgroundColor: isPrintEnabled ? "#021F69" : "#d3d3d3", // Change color based on enabled/disabled state
                          //   // color: isPrintEnabled ? "#ffffff" : "#a9a9a9",
                        }}
                        type="submit"
                        // disabled={!isPrintEnabled || loading}
                        className="sm:w-[70%] w-full ml-2"
                        endIcon={
                          loading ? (
                            <CircularProgress size={24} color="inherit" />
                          ) : null
                        }
                      >
                        Print
                      </Button>
                    </div>
                  </form>

                  <div className="border p-2 w-full">
                    <div className="grid grid-cols-1 gap-3">
                      <div className="mt-3">
                        <p className="font-semibold text-sm">
                          {paymentModes.name || "Payment Mode"}
                        </p>
                        <input
                          type="text"
                          value={cashAmount}
                          onChange={(e) => setCashAmount(e.target.value)}
                          className="w-full border border-gray-300 px-2 py-2 rounded-md"
                          placeholder={paymentModes.name || "Payment Mode"}
                        />
                      </div>
                      {(paymentModes.code === "4" || paymentModes.code === "5") && (
                        <>
                          <div className="mb-3">
                            <p className="font-semibold">Total Amount</p>
                            <input
                              type="text"
                              value={grossAmount}
                              readOnly
                              className="w-full border border-gray-300 px-2 py-2 rounded-md bg-[#E3EDEF]"
                              placeholder="Total Amount"
                            />
                          </div>
                          <div className="mb-3">
                            <p className="font-semibold">Change</p>
                            <input
                              type="text"
                              value={changeAmount}
                              readOnly
                              className="w-full border border-gray-300 px-2 py-2 rounded-md bg-[#E3EDEF]"
                              placeholder="Change"
                            />
                          </div>
                          <div className="mb-3">
                            <p className="font-semibold">Bank Approval Code</p>
                            <input
                              type="text"
                              value={bankApprovedCode}
                              onChange={(e) => setBankApprovedCode(e.target.value)}
                              className="w-full border border-gray-300 px-2 py-2 rounded-md"
                              placeholder="Enter Bank Approval Code"
                            />
                          </div>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default F3TenderCashPopUp;
