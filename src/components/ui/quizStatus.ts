export const statusToApi = (status: string) => {
  switch (status) {
    case "Open":
      return "1";
    case "Close":
      return "2";
    case "Draft":
      return "3";
    default:
      return "3";
  }
};

export const statusBadge = (status: string) => {
  switch (status) {
    case "Open":
      return "bg-green-100 text-green-700";
    case "Close":
      return "bg-red-100 text-red-700";
    case "Draft":
      return "bg-gray-100 text-gray-700";
    default:
      return "bg-gray-100 text-gray-700";
  }
};
