import {
  IsNotEmpty,
  IsOptional,
  MinLength,
} from 'class-validator'

export class PaymentValidator {
  @IsNotEmpty({
    message:
      'Field "idpel" is required and cannot be empty.',
  })
  @MinLength(1, {
    message:
      'Field "idpel" must have at least 1 character.',
  })
  idpel: string

  @IsOptional()
  ref1?: string

  @IsOptional()
  nominal?: string
}

export interface PaymentType {
  method: string // Metode payment, misal: 'cek'
  uid: string // User ID
  pin: string // PIN user
  produk: string // Produk, misal: 'PLNPRA' atau 'PLNPASCH'
  idpel: string // ID pelanggan
  ref1?: string // Referensi tambahan (opsional)
  nominal?: string // Nominal (opsional, default: 0)
}

export interface AuthTypePayment {
  uid: string // User ID
  pin: string // PIN user
}

export interface MandatoryTypePayment {
  responseCode?: string // Kode respons
  responseMessage?: string // Pesan respons
  kodeproduk: string // Kode produk
  tanggal: string // Tanggal transaksi
  idpel1: string // ID pelanggan 1
  idpel2: string // ID pelanggan 2
  idpel3: string // ID pelanggan 3
  nominal: string // Nominal transaksi
  admin: string // Biaya admin
  id_outlet: string // ID outlet
  pin: string // PIN user
  ref1: string // Referensi 1
  ref2: string // Referensi 2
  ref3: string // Referensi 3
  status?: string // Status transaksi
  keterangan?: string // Keterangan transaksi
  fee: string // Biaya transaksi
  saldo_terpotong: string // Saldo yang dipotong
  sisa_saldo: string // Sisa saldo
  total_bayar: string // Total yang dibayarkan
  [key: string]: string | object // Properti tambahan
  data?:
    | Record<string, string>
    | PlnPraTypePayment
    | PlnPaschTypePayment
    | PlnNonTypePayment // Data PLN. adding new product in here.
}

export interface PlnPraTypePayment {
  nomormeter: string //nomor meter listrik no.meter
  // idpel: string // IDPEL pelanggan
  namapelanggan: string // Nama pelanggan
  tarif: string // Tarif pelanggan
  daya: string // Daya pelanggan
  noref: string // nomer referensi
  nominal: string // nominal
  admin_bank: string //nominal admin
  total_bayar: string // nominal + nominal admin
  meterai: string // i dont fucking know man!
  ppn: string //ppn -> tetap ppn
  pbjttl: string //ppj -> nama lama.
  angsuran: string //angsuran
  totalkwh: string //JUmlah total kwh
  tokenpln: string // Token PLN PRA
}

export interface PlnPaschTypePayment {
  namapelanggan: string // Nama pelanggan
  nomormeter: string // Nomor meter pelanggan
  tarif: string // Tarif pelanggan
  daya: string // Daya pelanggan
  total_lembar_tag: string //Jumlah tunggakan // jumlah bill
  blth: string // bulan dan tahun.
  stan_meter: string // slalwbp1 - [jumlah bill = SAHLWBP1, SAHLWBP2, SAHLWBP3, SAHLWBP4]. 1-4 = jumlah bill
  rp_tag_pln: string //nominal
  admin_bank: string //nominal admin
  total_bayar: string //total bayar => nominal + nominal admin
}

export interface PlnNonTypePayment {
  namapelanggan: string // Nama pelanggan (subscribername)
  registrationdate: string // Tanggal Registration (registrationdate).
  reff: string // Reff (swrefnumber)WWWW
}
