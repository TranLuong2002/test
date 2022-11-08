using System;
using System.Collections.Generic;
using System.ComponentModel;
using System.Data;
using System.Drawing;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Windows.Forms;
using System.Data.SqlClient;

namespace bai_kiem_tra_TH8
{
    public partial class Form1 : Form
    {
        public Form1()
        {
            InitializeComponent();
        }

        SqlConnection ketnoi = new SqlConnection("Data Source=DESKTOP-KMNS09Q\\SQLEXPRESS;Initial Catalog=QUAN_LY_THUOC;Integrated Security=True");

        private void hienthi()
        {
            SqlDataAdapter sda = new SqlDataAdapter("select * from THUOC", ketnoi);//dùng để thực thi câu lệnh sql
            DataTable dt = new DataTable();//tạo bảng trống 
            sda.Fill(dt);//dùng phương thức fill để đổ dữ liệu vào bảng trống vừa tạo
            dataGridView1.DataSource = dt;//đổ từ bảng trống vừa tạo vào datagridview.
        }
        private void button1_Click(object sender, EventArgs e)
        {
            string sqlthem = "insert into THUOC values(@maThuoc,@tenThuoc,@NSX,@HSD,@gia)";//tạo một thuộc tính có sử dụng câu lệnh sql 
            SqlCommand sc = new SqlCommand(sqlthem, ketnoi);//phương thức thực thi câu lệnh
            sc.Parameters.AddWithValue("maThuoc", textBox1.Text);//nhập dữ liệu
            sc.Parameters.AddWithValue("tenThuoc", textBox2.Text);//nhập dữ liệu
            sc.Parameters.AddWithValue("NSX", dateTimePicker1.Text);//nhập dữ liệu
            sc.Parameters.AddWithValue("HSD", dateTimePicker2.Text);//nhập dữ liệu
            sc.Parameters.AddWithValue("gia", textBox3.Text);//nhập dữ liệu
            sc.ExecuteNonQuery();//câu lệnh thực thi sql
            hienthi();//gọi đến phương thức hiển thị
        }

        private void Form1_Load(object sender, EventArgs e)
        {
            ketnoi.Open();
            hienthi();
        }
    }
}
