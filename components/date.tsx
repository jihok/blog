import { parseISO, format as formatFn } from "date-fns";

const makeDate = (value: number | string) => {
  if (typeof value === "string") {
    return parseISO(value);
  } else {
    // we only need to handle UNIX timestamps so far, so we convert seconds to milliseconds
    return new Date(value * 1000);
  }
};

interface IDateComponent {
  value: number | string;
  format?: string;
}

export const DateComponent = ({
  value,
  format = "LLLL d, yyyy",
}: IDateComponent) => {
  const formattedDate = formatFn(makeDate(value), format);
  return <time dateTime={formattedDate}>{formattedDate}</time>;
};
