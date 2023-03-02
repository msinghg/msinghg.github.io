{{/* vim: set filetype=mustache: */}}
{{/*
Expand the name of the chart.
*/}}
{{- define "extension-management.name" -}}
{{- default .Chart.Name .Values.nameOverride | trunc 63 | trimSuffix "-" -}}
{{- end -}}

{{/*
Create a default fully qualified app name.
We truncate at 63 chars because some Kubernetes name fields are limited to this (by the DNS naming spec).
If release name contains chart name it will be used as a full name.
*/}}
{{- define "extension-management.fullname" -}}
{{- if .Values.fullnameOverride -}}
{{- .Values.fullnameOverride | trunc 63 | trimSuffix "-" -}}
{{- else -}}
{{- $name := default .Chart.Name .Values.nameOverride -}}
{{- if contains $name .Release.Name -}}
{{- .Release.Name | trunc 63 | trimSuffix "-" -}}
{{- else -}}
{{- printf "%s-%s" .Release.Name $name | trunc 63 | trimSuffix "-" -}}
{{- end -}}
{{- end -}}
{{- end -}}

{{/*
Create chart name and version as used by the chart label.
*/}}
{{- define "extension-management.chart" -}}
{{- printf "%s-%s" .Chart.Name .Chart.Version | replace "+" "_" | trunc 63 | trimSuffix "-" -}}
{{- end -}}

{{/* 
Add the vault-injector template
*/}}
{{- define "vault.injector.annotations" -}}
{{- if .Values.vault.enabled -}}
vault.hashicorp.com/agent-inject: 'true'
vault.hashicorp.com/role: {{ include "extension-management.fullname" . }}
vault.hashicorp.com/agent-pre-populate-only: 'true'
vault.hashicorp.com/agent-init-first: 'true'
{{- range .Values.vault.secrets }}
vault.hashicorp.com/agent-inject-secret-{{ .name }}: {{ .path | quote }}
vault.hashicorp.com/agent-inject-template-{{ .name }}: |
  {{printf "{{- with secret "}}{{ .path | quote }}{{` -}}`}}
  {{- range .variables}}
  export {{ .bindTo }}{{ printf "=\"{{ index .Data"}} {{ .name | quote }} {{`}}"` }}
  {{- end }}  
  {{`{{- end }} `}}
{{- end }}
{{- end }}
{{- end }}

{{- define "vault.injector.service-account" -}}
{{- if .Values.vault.enabled -}}
serviceAccountName: {{ include "extension-management.fullname" . }}
{{- end }}
{{- end }}