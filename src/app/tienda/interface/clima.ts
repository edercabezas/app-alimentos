export interface Clima {

  date: string;
  temp2m: Temp2m;
  weather: string;
  wind10m_max: number;
}


export interface Temp2m {
  max: number;
  min: number;
}
