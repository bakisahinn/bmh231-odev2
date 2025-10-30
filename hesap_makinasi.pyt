def hesapla(sayi1, sayi2, islem):
    
    try:
        if islem == '+':
            return sayi1 + sayi2
        elif islem == '-':
            return sayi1 - sayi2
        elif islem == '*':
            return sayi1 * sayi2
        elif islem == '/':
            if sayi2 == 0:
                return "Hata: Sıfıra bölünmez!"
            return sayi1 / sayi2
        else:
            return "Hata: Geçersiz işlem!"
    except Exception as e:
        return f"Hata: {e}"

def main():
    print("Hesap Makinesi ")
    while True:
        s = input().strip()
        try:
            sayi1_str, islem, sayi2_str = s.split()
            sayi1, sayi2 = float(sayi1_str), float(sayi2_str)
        except ValueError:
            print("Girdi hatası")
            continue
        except Exception as e:
            print(f"Bilinmeyen hata: {e}")
            continue

        sonuc = hesapla(sayi1, sayi2, islem)
        print("= ", sonuc)
        print("-" * 30)

if __name__ == "__main__":
    main()
