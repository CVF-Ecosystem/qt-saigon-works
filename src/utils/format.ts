const vndFormatter = new Intl.NumberFormat("vi-VN", {
  style: "currency",
  currency: "VND",
  maximumFractionDigits: 0
});

export function formatVnd(value: number) {
  return vndFormatter.format(value);
}

export function formatCompactVnd(value: number) {
  if (value >= 1000000000) {
    return `${(value / 1000000000).toLocaleString("vi-VN", {
      maximumFractionDigits: 1
    })} ty`;
  }

  if (value >= 1000000) {
    return `${Math.round(value / 1000000).toLocaleString("vi-VN")} tr`;
  }

  return formatVnd(value);
}
