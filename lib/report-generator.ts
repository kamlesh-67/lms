import jsPDF from 'jspdf'
import autoTable from 'jspdf-autotable'

export async function generateReportPDF(
    data: any[],
    reportName: string,
    filename: string
): Promise<void> {
    const pdf = new jsPDF()

    // Brand colors
    const primaryColor: [number, number, number] = [6, 19, 89] // Navy
    const accentColor: [number, number, number] = [255, 148, 0] // Orange

    // Header
    pdf.setFillColor(primaryColor[0], primaryColor[1], primaryColor[2])
    pdf.rect(0, 0, 210, 25, 'F')

    // Logo/Title
    pdf.setTextColor(255, 255, 255)
    pdf.setFontSize(20)
    pdf.setFont('helvetica', 'bold')
    pdf.text('LMD PORTAL', 14, 12)

    pdf.setFontSize(10)
    pdf.setFont('helvetica', 'normal')
    pdf.text('Emirates Logistics Express', 14, 18)

    // Report Title
    pdf.setTextColor(accentColor[0], accentColor[1], accentColor[2])
    pdf.setFontSize(16)
    pdf.setFont('helvetica', 'bold')
    pdf.text(reportName, 105, 15, { align: 'center' })

    // Report Info
    pdf.setTextColor(0, 0, 0)
    pdf.setFontSize(10)
    pdf.setFont('helvetica', 'normal')
    pdf.text(`Generated: ${new Date().toLocaleString()}`, 14, 32)
    pdf.text(`Total Records: ${data.length}`, 14, 38)

    // Extract headers from first object
    const headers = data.length > 0 ? Object.keys(data[0]) : []

    // Prepare table data
    const tableData = data.map((row) => headers.map((header) => row[header]))

    // Generate table
    autoTable(pdf, {
        startY: 45,
        head: [headers],
        body: tableData,
        theme: 'striped',
        headStyles: {
            fillColor: primaryColor,
            textColor: [255, 255, 255],
            fontStyle: 'bold',
            fontSize: 10,
        },
        alternateRowStyles: {
            fillColor: [245, 245, 245],
        },
        styles: {
            fontSize: 9,
            cellPadding: 3,
        },
        margin: { top: 45, left: 14, right: 14 },
    })

    // Footer
    const pageCount = (pdf as any).internal.getNumberOfPages()
    for (let i = 1; i <= pageCount; i++) {
        pdf.setPage(i)
        pdf.setFontSize(8)
        pdf.setTextColor(150, 150, 150)
        pdf.text(
            `Page ${i} of ${pageCount}`,
            105,
            pdf.internal.pageSize.height - 10,
            { align: 'center' }
        )
        pdf.text(
            'www.lmdportal.com | +971-800-LMD-PORTAL',
            105,
            pdf.internal.pageSize.height - 5,
            { align: 'center' }
        )
    }

    pdf.save(filename)
}
