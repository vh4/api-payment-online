import {
  IsNotEmpty,
  IsOptional,
  MinLength,
} from 'class-validator'

export class InquiryValidator {
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

export interface InquiryType {
  method: string // Metode inquiry, misal: 'cek'
  uid: string // User ID
  pin: string // PIN user
  produk: string // Produk, misal: 'PLNPRA' atau 'PLNPASCH'
  idpel: string // ID pelanggan
  ref1?: string // Referensi tambahan (opsional)
  nominal?: string // Nominal (opsional, default: 0)
}

export interface AuthTypeInquiry {
  uid: string // User ID
  pin: string // PIN user
}

export interface MandatoryTypeInquiry {
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
    | PlnPraTypeInquiry
    | PlnPaschTypeInquiry
    | PlnNonTypeInquiry // Data PLN. adding new product in here.
}

export interface PlnPraTypeInquiry {
  nomormeter: string //nomor meter listrik no.meter
  idpel: string // IDPEL pelanggan
  namapelanggan: string // Nama pelanggan
  tarif: string // Tarif pelanggan
  daya: string // Daya pelanggan
}

export interface PlnPaschTypeInquiry {
  namapelanggan: string // Nama pelanggan
  idpel: string // id pelanggan
  total_lembar_tag: string //Jumlah tunggakan // jumlah bill
  blth: string // bulan dan tahun.
  stan_meter: string // slalwbp1 - [jumlah bill = SAHLWBP1, SAHLWBP2, SAHLWBP3, SAHLWBP4]. 1-4 = jumlah bill
  rp_tag_pln: string //nominal
  admin_bank: string //nominal admin
  total_bayar: string //total bayar => nominal + nominal admin
}

export interface PlnNonTypeInquiry {
  transaksi: string //Nama jenis transaksi dari PLN
  noregistration: string // Nomer registrasi -> idpel
  namapelanggan: string // Nama pelanggan PLN
  biaya_pln: string // biaya pln -> nominal
  admin_bank: string //nominal admin
  total_bayar: string //total bayar => nominal + nominal admin
}
