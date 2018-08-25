import configuration from "./configuration";
import { getPublicIp } from "./publicIp";

const cf = require('cloudflare')(configuration.cloudflare);

interface Zone {
    name: string;
    id: string;
}

interface DnsRecord {
    id: string;
    name: string;
    content: string;
}

export const updatePublicIpOnDomain = async (domain: string, subDomain: string) => {

    const subDomainName = `${subDomain}.${domain}`;

    const zones = await cf.zones.browse();
    const domainRecord = zones.result.find((z: Zone) => z.name === domain);

    const recordsResult = await cf.dnsRecords.browse(domainRecord.id);
    const records: DnsRecord[] = recordsResult.result;
    const subDomainRecord: DnsRecord | undefined = records.find((r) => r.name === subDomainName);
    if (subDomainRecord) {
        const publicIp = await getPublicIp();
        if (subDomainRecord.content !== publicIp) {
            const updateRecordResult = await cf.dnsRecords.edit(domainRecord.id, subDomainRecord.id, publicIp);
            console.log(updateRecordResult);
        } else {
            console.info('no need to change public ip on', subDomainName, publicIp);
        }
    }
}
