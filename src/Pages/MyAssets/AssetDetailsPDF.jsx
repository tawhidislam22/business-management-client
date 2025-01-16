import React from "react";
import { Page, Text, View, Document, StyleSheet } from "@react-pdf/renderer";

const styles = StyleSheet.create({
  page: { padding: 30 },
  section: { marginBottom: 10 },
  header: { fontSize: 18, fontWeight: "bold", marginBottom: 10 },
});

const AssetDetailsPDF = ({ asset }) => (
  <Document>
    <Page style={styles.page}>
      <View style={styles.section}>
        <Text style={styles.header}>Asset Details</Text>
        <Text>Asset Name: {asset.name}</Text>
        <Text>Asset Type: {asset.type}</Text>
        <Text>Request Date: {new Date(asset.requestDate).toLocaleDateString()}</Text>
        <Text>Approval Date: {asset.approvalDate ? new Date(asset.approvalDate).toLocaleDateString() : "N/A"}</Text>
      </View>
      <Text style={{ marginTop: 20 }}>Generated on: {new Date().toLocaleDateString()}</Text>
    </Page>
  </Document>
);

export default AssetDetailsPDF;
