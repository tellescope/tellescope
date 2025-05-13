import React from "react"
import { Divider, Grid, Typography } from "@mui/material"
import { Enduser, FormResponse } from "@tellescope/types-client"
import { form_response_value_to_string, formatted_date, getOrgnizationLogoURL, remove_script_tags, user_display_name } from "@tellescope/utilities"
import { DownloadFileIconButton, LabeledIconButton, SecureImage, useEndusers, useOrganization, useResolvedSession, useSession, useUsers, value_is_loaded } from "../index"
import CloseIcon from '@mui/icons-material/Close';
import { DatabaseSelectResponse, FormResponseAnswerAddress, FormResponseValueAnswer } from "@tellescope/types-models"
import { Image } from "../layout"

const answerStyles: React.CSSProperties = {
  width: '375px',
  borderBottom: '1px solid black',
}

export const AddressDisplay = ({ value } : { value: Required<FormResponseAnswerAddress>['value'] }) => (
  <Grid container direction="column">
    <Typography sx={{ ...answerStyles, mb: 1 }}>
      {value.addressLineOne} {value.addressLineTwo}
    </Typography> 
    <Typography sx={answerStyles}>
      {value.city} {value.state}, {value.zipCode}
    </Typography> 
  </Grid>
) 

export const ResponseAnswer = ({ formResponse, fieldId, isHTML, answer: a, printing, onImageClick } : { 
  answer: FormResponseValueAnswer, 
  formResponse: FormResponse,
  fieldId: string,
  printing?: boolean,
  onImageClick?: (args: { src: string }) => void,
  isHTML?: boolean,
}) => (
((isHTML || a.type === 'Rich Text') && typeof a.value === 'string') 
  ? <div dangerouslySetInnerHTML={{ __html: remove_script_tags(a.value) }} />
  : a.value 
    ? (
    <Typography component="div">
      {(a.type === 'multiple_choice' || a.type === 'Database Select')
        ? (
         <div>
          {a.value.map((t, i) => 
            <div key={i}>
            <input type="checkbox" checked/>
            <label style={{ marginLeft: '4px' }}>
              {a.type === 'Database Select' ? (t as DatabaseSelectResponse).text : t}
            </label>
            </div>
          )}
         </div>
        )
      : a.value === '_question_group' ? <></>
      : a.type === 'ranking'
        ? <ol style={{ margin: 0 }}>
            {a.value.map((t, i) => 
              <li key={i}>{t}</li>
            )}
          </ol>
      : a.type === 'file'
        ? a.value.secureName 
          ? <Typography>
              {!printing 
                ? <DownloadFileIconButton secureName={a.value.secureName} onDownload={url => window.open(url, '_blank')} />
                : (
                  <SecureImage secureName={a.value.secureName} onImageClick={onImageClick}
                    style={{ maxHeight: 400, maxWidth: 400 }}
                  />
                )
              }
              <em>{a.value.name || 'Attachment'}</em>
            </Typography>
          : null // null when optional and omitted
      : a.type === 'files'
        ? a.value.map(file => (
          <Typography key={file.secureName}>
            {!printing 
              ? <DownloadFileIconButton secureName={file.secureName} onDownload={url => window.open(url, '_blank')} />
              : (
                <SecureImage secureName={file.secureName} 
                  style={{ maxHeight: 400, maxWidth: 400 }}
                />
              )
            }
            <em>{file.name || 'Attachment'}</em>
          </Typography>
        ))
      : a.type === 'signature'
        ? <Typography style={answerStyles}>
            {a.value.signed ? <span>Electronically signed as <em>{a.value.fullName}</em></span> : 'Unsigned'}
          </Typography>
      : a.type === 'stringLong'
        ? (
          <Grid container direction="column">
          {a.value.split('\n').map((line, i) => (
            <Typography key={i} style={answerStyles}>
              {line || <br />}    
            </Typography>
          ))}
          </Grid>
        )
      : (a.type === 'Address' && a.value)
        ? <AddressDisplay value={a.value} />
      : a.type === 'date'
        ? <Typography style={answerStyles}>
            {new Date(a.value).toDateString()} {new Date(a.value).toTimeString().split(' ')[0]}
          </Typography>
      : (a.type === 'Medications' && a.value)
        ? (
          // modified from enduser_views MedicationsResponseDisplay in private webapp 
          <Grid container direction="column" sx={{ overflowX: 'auto'}}>
            {a.value.map((medication, i) => (
              <Grid item key={i}>
              <Grid container direction="column">
                <Grid item>
                <Typography style={{ fontWeight: 'bold' }}>
                {medication.drugName && medication.drugName !== 'Unknown'
                  ? medication.drugName
                  : medication.displayTerm  
                }
                </Typography>
                </Grid>

                <Grid item style={{ marginLeft: 20 }}>
                  <Typography>
                    {medication.dosage?.quantity ? `${medication.dosage.quantity} units` : ''}
                    {medication.dosage?.frequency 
                      ? `${medication.dosage?.quantity ? ', ' : ''}${medication.dosage.frequency}x daily` 
                      : ''
                    }
                  </Typography>
                </Grid>

                {medication.reasonForTaking && 
                  <Grid item style={{ marginLeft: 20 }}>
                    <Typography>
                      Reason: {medication.reasonForTaking}
                    </Typography>
                  </Grid>
                }
              </Grid>
              </Grid>
            ))}
          </Grid>
        )
        : (a.type === 'Emotii') ? (() => {
            if (!a.value) return null
            const scoring = formResponse?.emotii?.find(s => s.id === fieldId)
            if (!scoring) return null
        
            return (
              <>
              {[{ label: 'Average', ...scoring.scores.total }, ...scoring.scores.byAnswer].map((s, i) => (
                <Typography>{s.label}: {s.score}</Typography>
              ))}
              </>
            )

          })()
        : (a.type === 'Related Contacts' && a.value && a.value.length > 0) ? (
          <Grid container direction="column" spacing={1}>
          {a.value.map((v, i) => (
            <Grid item key={i}>
              <Typography>
                {v.fname}{v.lname && ` ${v.lname}`}{v.dateOfBirth && ` ${v.dateOfBirth}`}{v.email && `, ${v.email}`}{v.phone && `, ${v.phone}`}
              </Typography>
            </Grid>
          ))}
          </Grid>
        )
        : (
          <Typography style={answerStyles}>
            {form_response_value_to_string(a.value)}
          </Typography>
        )
      }
    </Typography>
  ) : (
    a.type === 'description'
      ? <></>
      : <Typography>No value provided</Typography>
  )
)

export const OrganizationLogo = () => {
  const [organizationLoading] = useOrganization()
  
  if (!value_is_loaded(organizationLoading)) return null
  if (typeof organizationLoading.value.logoVersion !== 'number') return null

  const logoURL = getOrgnizationLogoURL(organizationLoading.value)

  return (
    <Image 
      src={logoURL} 
      alt=""
      maxWidth={400}
      height={50}
    />
  )
}

export const ResolveOrganizationLogo = ({ logoURL } : { logoURL?: string }) => {
  const session = useResolvedSession()

  if (logoURL) {
    return (
      <Image 
        src={logoURL} 
        alt=""
        maxWidth={400}
        height={50}
      />
    )
  }

  if (session.type === 'enduser') return null

  return <OrganizationLogo />
}

interface FormResponse_T {
  enduser?: Enduser,
  onClose?: () => void,
  hideHeader?: boolean,
  response: FormResponse,
  id?: string,
  logoURL?: string,
  showAnswerInline?: boolean,
}
// this should use all vanilla React / inline styles to ensure printing is consistent
export const FormResponseView = ({ showAnswerInline=true, logoURL, enduser, onClose, hideHeader, response, id, printing, onImageClick } : FormResponse_T & { 
  printing?: boolean,
  onImageClick?: (args: { src: string }) => void,
}) => {
  const [, { findById: findUser }] = useUsers()

  const user = findUser(response.submittedBy ?? '')

  if (response.responses === undefined || response.responses.length === 0) {
    return <Typography>Awaiting Response</Typography> 
  }

  return (
    <div style={{ display: 'flex', flex: 1, flexDirection: 'column', minWidth: 400, maxWidth: 650 }} id={id}>
      <div style={{ textAlign: 'center' }}>
        {!hideHeader && 
          <>
          <ResolveOrganizationLogo logoURL={logoURL} />

          <h2 style={{
            fontSize: 20,
            fontWeight: 'bold',
            marginTop: 8,
          }}> 
            {response.formTitle}
          </h2>
          </>
        }

        {onClose 
          ? <LabeledIconButton Icon={CloseIcon} label="Close" onClick={onClose} />
          : <Grid />
        }
      </div>

      {enduser && 
        <Typography style={{
          fontSize: 18,
          color: 'black',
          paddingBottom: 4,
          textAlign: 'center',
        }}>
          {user_display_name(enduser)}
        </Typography>
      }

      {(enduser || response.userEmail || response.submittedBy) && !hideHeader &&
        <Typography style={{
          fontSize: 16,
          paddingBottom: 4,
          textAlign: 'center',
        }}>
          {response.submittedBy
            ? (user 
                ? <span>
                  Submitted by {user_display_name(user)}
                </span>
                : '' // still loading, or can't find user for submittedBy
              )
            : <span> 
                From {user_display_name(enduser ?? { email: response.userEmail } as Enduser)}
              </span>
          }
        </Typography>
      }

      {
        <div style={{ textAlign: 'center', paddingBottom: 4 }}>
        <i>
          {formatted_date(new Date(response.submittedAt || response.createdAt))}
        </i>
        </div>
      }


      <Divider flexItem style={{ marginTop: 2, marginBottom: 12 }} />

      <div style={{ flexDirection: "column", display: 'flex', flex: 1 }}>
      {response.responses.map((r, i) => (
          <div key={i} style={{ marginBottom: 12 }}>
            <div style={{ display: 'flex', flex: 1, flexDirection: "row", justifyContent: 'space-between', flexWrap: 'nowrap' }}>
              {r.fieldTitle && 
                <div style={{ }}>
                  <Typography style={{
                    fontWeight: 'bold',
                    width: (
                      showAnswerInline 
                        ? '400px'
                        : undefined
                    )
                  }}>
                    {r.fieldTitle}
                  </Typography>
                </div>
              }

              <div style={{ }}>
                {showAnswerInline && r.answer.type !== 'Question Group' 
                && !(typeof r.answer.value === 'string' && r.answer.value.includes('{TELLESCOPE')) // hidden field for matching, not to display
                && (
                  (r.answerIsHTML && typeof r.answer.value === 'string') 
                    ? <div dangerouslySetInnerHTML={{ __html: remove_script_tags(r.answer.value) }} />
                    : <ResponseAnswer fieldId={r.fieldId} formResponse={response} answer={r.answer} printing={printing} />
                )
                }
              </div>
            </div>

            {r.fieldDescription
              ? (
                <Typography style={{  }}>
                  {r.fieldDescription}
                </Typography>
              ): r.fieldHtmlDescription
                ? (
                  <div dangerouslySetInnerHTML={{
                    __html: r.fieldHtmlDescription
                  }} />
                )
                : null
            } 

            {!showAnswerInline &&
              <ResponseAnswer answer={r.answer} formResponse={response} fieldId={r.fieldId} />
            }
          </div>
        )
      )}
      </div>

      {(response.addenda || []).length > 0 &&
        <div style={{ borderBottom: '1px solid #00000088', width: '100%', marginTop: 10, marginBottom: 10 }} />
      }

      {(response.addenda || []).map((a, i) => (
        <div key={i} style={{ marginTop: 10 }}>
          <div style={{ fontWeight: 'bold', fontSize: 15 }}>
            Addendum {i + 1} by {user_display_name(findUser(a.userId, { batch: true }))} at {formatted_date(new Date(a.timestamp))}
          </div>

          <div style={{ fontSize: 14 }}>
            {a.text.split('\n').map((v, t) => <div key={t}>{v}</div>)}
          </div>
        </div>
      ))}
    </div>
  )
}