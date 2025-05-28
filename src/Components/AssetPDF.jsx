import { Document, Page, Text, View, StyleSheet } from '@react-pdf/renderer';

const styles = StyleSheet.create({
  page: {
    flexDirection: 'column',
    backgroundColor: '#ffffff',
    padding: 30
  },
  header: {
    fontSize: 24,
    marginBottom: 20,
    textAlign: 'center'
  },
  section: {
    margin: 10,
    padding: 10,
    flexGrow: 1
  },
  row: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#000000',
    borderBottomStyle: 'solid',
    paddingVertical: 5
  },
  label: {
    width: '30%',
    fontWeight: 'bold'
  },
  value: {
    width: '70%'
  }
});

const AssetPDF = ({ asset }) => (
  <Document>
    <Page size="A4" style={styles.page}>
      <Text style={styles.header}>Asset Request Details</Text>
      
      <View style={styles.section}>
        <View style={styles.row}>
          <Text style={styles.label}>Asset Name:</Text>
          <Text style={styles.value}>{asset.name}</Text>
        </View>
        
        <View style={styles.row}>
          <Text style={styles.label}>Asset Type:</Text>
          <Text style={styles.value}>{asset.type}</Text>
        </View>
        
        <View style={styles.row}>
          <Text style={styles.label}>Request Date:</Text>
          <Text style={styles.value}>
            {new Date(asset.requestDate).toLocaleDateString()}
          </Text>
        </View>
        
        <View style={styles.row}>
          <Text style={styles.label}>Status:</Text>
          <Text style={styles.value}>{asset.status}</Text>
        </View>
        
        {asset.approvedDate && (
          <View style={styles.row}>
            <Text style={styles.label}>Approved Date:</Text>
            <Text style={styles.value}>
              {new Date(asset.approvedDate).toLocaleDateString()}
            </Text>
          </View>
        )}
        
        {asset.notes && (
          <View style={styles.row}>
            <Text style={styles.label}>Notes:</Text>
            <Text style={styles.value}>{asset.notes}</Text>
          </View>
        )}
      </View>
      
      <View style={[styles.section, { marginTop: 20 }]}>
        <Text style={{ fontSize: 10, textAlign: 'center', color: '#666666' }}>
          This document was generated on {new Date().toLocaleDateString()} and is an official record of the asset request.
        </Text>
      </View>
    </Page>
  </Document>
);

export default AssetPDF; 