type WIDGET_VARIANTS =
  | 'orderImpacts'
  | 'offsetPerOrder'
  | 'offsetByProduct'
  | 'offsetBySpend'
  | 'offsetByStoreRevenue'
  | 'byPercentage'
  | 'byPercentageOfRevenue'
  | 'stats'
  | 'static'
  | 'banner'

export const EnumToWidgetTypeMap: Record<string, WIDGET_VARIANTS> = {
  '0' : 'orderImpacts',
  '1' : 'offsetPerOrder',
  '2' : 'offsetByProduct',
  '3' : 'offsetBySpend',
  '4' : 'offsetByStoreRevenue',
  '5' : 'byPercentage',
  '6' : 'byPercentageOfRevenue',
  '7' : 'stats',
  '8' : 'static',
  '9' : 'banner',
} as const
