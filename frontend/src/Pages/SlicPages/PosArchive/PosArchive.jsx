import React, { useEffect, useState } from "react";
import SideNav from "../../../components/Sidebar/SideNav";
import { useNavigate } from "react-router-dom";
import { posHistoryInvoiceColumns } from "../../../utils/datatablesource";
import DataTable from "../../../components/Datatable/Datatable";
import newRequest from "../../../utils/userRequest";
import { toast } from "react-toastify";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";

const PosArchive = () => {
  const [data, setData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const fetchData = async () => {
    setIsLoading(true);
    try {
      const response = await newRequest.get("/Invoice/v1/masters");
      // console.log(response?.data?.data);
      setData(response?.data?.data || []);
      setIsLoading(false);
    } catch (err) {
      setIsLoading(false);
      toast.error(err?.response?.data?.message || "Something went Wrong");
    }
  };

  useEffect(() => {
    // fetchData(); // Calling the function within useEffect, not inside itself
  }, []);

  const handleRowClickInParent = async (item) => {
    // console.log(item)
    if (item.length === 0) {
    //   setFilteredData(secondGridData);
      return;
    } 
  };

  return (
    <SideNav>
      <div className="p-3 h-full">
        
        <div className="h-auto w-full shadow-xl">
          <div
            style={{
              marginLeft: "-11px",
              marginRight: "-11px",
            }}
          >
            <DataTable
              data={data}
              title={"POS Archive"}
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
      </div>
    </SideNav>
  );
};

export default PosArchive;
