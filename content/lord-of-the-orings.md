---
title: 'LORD OF THE ORINGS (CVE-2022-3203): Vulnerability Analysis of an Industrial Access Point'
date: Fri, 16 Sep 2022 14:23:17 +0000
draft: false
tags: ['admin', 'Cybersecurity', 'Industrial Partnership', 'Trustworthy Smart Systems', 'no responses']
sidebar_right: sidebar3
weight: 45
custom_class: custom-title-font-lord
#TODO mettere link a twitter, facebook e google+(ma chi lo usa?)
---

**Lorenzo Bazzana, Marino Miculan (MADS lab, University of Udine)  
Michele Codutti (Danieli Automation)**

Operation Technology, i.e. the hardware and software that monitor and control industrial equipment, assets, processes and events, is required to respect high standards of security and reliability. Unfortunately, the analysis and security assessment of OT is less mature than that of Information Technology. In fact, products and components used in industrial plants often have issues that must be dealt with.  Most of the times, these issues are not very dangerous, e.g. because they are hard to exploit, but sometimes… this is not the case.

In this page, we document the discovery of a backdoor in an industrial Access Point.  This work has been carried out within a cooperation between the [MADS Lab](/) of the University of Udine and [Danieli Automation](https://www.dca.it), aiming to analyze vulnerabilities of the devices that Danieli Automation re-sell or produce. **We provide this information for academic and teaching purposes**, as it is a good example about these activities are carried out in practice.

### Analysis

The device is an 802.11 b/g/n access point [Oring Net IAP-420+](https://oringnet.com/en-global/products/detail/P0000000449/85/?IAP-420+) that is installed inside a local unit, near the industrial machine that it is connected to. Using the wireless network provides by the AP, an operator can connect to the machine for diagnostic and maintenance purposes, from a safe distance from the machine itself. 

The analysis followed these steps:

1.  Reading the manuals to understand how the device works and define the first attack surface
2.  Access to the device to verify the attack surface
3.  Proper vulnerability assessment to determine the software components that are running and the known vulnerabilities present

After these steps, we found that some default settings yield to vulnerabilities easily exploitable; these issues can be fixed by suitably reconfiguring the AP.

But there was something stranger in the port scan report.

To configure the access point, the manual describes only one way: via web interface. But we found that a **telnet server** was listening on the default port (23/TCP). Maybe there is also a CLI interface via telnet? Connecting to that port we receive a login prompt, for which the admin credentials of the web interface do not work:

[![](/images/telnetap.jpg)](/images/telnetap.jpg)

This is a hint that this telnet server is not meant to be used by the user or admin. So, let’s see if we can exploit this access retrieving those credentials.

We can try a brute force attack to the telnet server, but it is slow and with low success probability. An alternative is to seek the credentials inside the firmware image, which is available to customers from the manufacturer’s website. 

Using the [firmware mod kit](https://github.com/rampageX/firmware-mod-kit) the firmware was easily unpacked and inside it looks like a standard Linux embedded system with a twist: there are two /etc directories, one properly named “/etc” and one named “/etc\_ro”. It seems that the firmware is designed to have some configuration files that are immutable and some not.

In the “/etc/inittab” we can locate the main init script, which is named “/etc/rcS”. Looking into it we found our treasure: the root password is set with a fixed value, every time the AP is rebooted.

[![](/images/image-1.png)](/images/image-1.png)

Using these credentials, any user connected to the AP (even via WiFi) can immediately login as root, and therefore gain the complete control of the AP – the worst possible scenario. (Password is obfuscated in order to not disclose the specific credentials.)

From this script, we can figure out that the telnet service has been activated for debugging purposes; the service should have been removed in the released firmware.

(In the case we could not find the password in clear in the firmware, we could have tried to reverse the hash of the password from the “/etc/passwd” file, via rainbow tables.)

### Remediation plan

When we discovered this vulnerability, we immediately contacted the product manufacturer. The correct remediation plan is to remove the telnet service and the password from the firmware. A temporary solution is to login as root (exploiting the vulnerability) and change the root password; however, it is important to notice that this must be done at every reboot of the AP, since the init script restores the original (and discoverable) password.

A firmware update (Ver 2.01e) was provided by Oring in a week. Before upgrading our device, we analyzed the new firmware to check if the issue was addressed correctly.

Using the same tools of the trade we unpacked the new firmware and re-check the init-script:

[![](/images/image.png)](/images/image.png)

The image shows a side-by-side comparison obtained by the diff command. The old version of the file is on the left the new is on the right. The red lines are what is missing from the old file in the new (the password is obfuscated as before).

All the commands that are creating the root user, changing his password and launching telnet server were removed. The root user is present in the “/etc/passwd” file but the password is hashed.

Download links (registration required):

[https://oringnet.com/en-global/products/download/638](https://oringnet.com/en-global/products/download/638%20-%20IAP-420) for IAP420

[https://oringnet.com/en-global/products/download/637](https://oringnet.com/en-global/products/download/637%20IAP420) for IAP420+ (POE)

### Conclusions

In this report we have described the discovery of a severe vulnerability of an industrial WiFi access point.  The vulnerability is a hidden feature, which allows for the execution of a complete remote shell with root privileges. This vulnerability is officially described in the CVE Id [CVE-2022-3203](https://cve.mitre.org/cgi-bin/cvename.cgi?name=CVE-2022-3203), with a severity grade of 9.8 out of 10. The CVSS vector is: 3.1/AV:N/AC:L/PR:N/UI:N/S:U/C:H/I:H/A:H.

This result is one of the results of the fruitful collaborations between the MADS lab of the University of Udine and Danieli Automation. It confirms once more the need for deep and careful analysis of software and hardware components for OT. 

So: keep hacking!
