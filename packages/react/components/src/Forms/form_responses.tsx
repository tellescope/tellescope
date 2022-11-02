import React from "react"
import { Grid, Typography } from "@mui/material"
import { Enduser, FormResponse } from "@tellescope/types-client"
import { user_display_name } from "@tellescope/utilities"
import { DownloadFileIconButton, LabeledIconButton, useUsers } from "../index"
import CloseIcon from '@mui/icons-material/Close';

interface FormResponse_T {
  enduser?: Enduser,
  onClose?: () => void,
  hideHeader?: boolean,
  response: FormResponse,
}
export const FormResponseView = ({ enduser, onClose, hideHeader, response } : FormResponse_T) => {
  const [, { findById: findUser}] = useUsers()

  const user = findUser(response.submittedBy ?? '')

  return (
    <Grid container alignItems="center" justifyContent="center" style={{
      minWidth: 400,
      maxHeight: '75vh',
      overflowY: 'auto',
    }}>
      {(response.responses === undefined || response.responses.length === 0)
        ? <Typography>Awaiting Response</Typography>
        : <>
          <Grid item xs={12}>
          <Grid container alignItems="center" justifyContent={'space-between'}>
            {!hideHeader && 
              <Typography component="h2" style={{
                fontSize: 20,
                fontWeight: 'bold',
              }}> 
                {response.formTitle}
              </Typography>
            }

            {onClose 
              ? <LabeledIconButton Icon={CloseIcon} label="Close" onClick={onClose} />
              : <Grid />
            }
          </Grid>
          </Grid>
          {(enduser || response.userEmail || response.submittedBy) && !hideHeader &&
            <Grid item xs={12}>
              <Typography style={{
                fontSize: 16,
                paddingBottom: 4,
                borderBottom: "1px solid #00000033",
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
            </Grid>
           }
          {response.responses.map((r, i) => {
            const q = r.fieldTitle
            const a = r.answer
            const description = r.fieldDescription
            
            return (
              <Grid item xs={12} key={i} style={{
                paddingTop: 8,
                paddingBottom: 4,
                borderBottom: "1px solid #00000033",
              }}>
              <Typography style={{ fontWeight: 'bold' }}>
                {q}
              </Typography>
              {description &&
                <Typography style={{  }}>
                  {description}
                </Typography>
              } 
              {a.value 
                ? (
                <Typography component="div">
                  {a.type === 'multiple_choice'
                    ? <ul style={{ margin: 0 }}>
                        {a.value.map((t, i) => 
                          <li key={i}>{t}</li>
                        )}
                      </ul>
                  : a.type === 'file'
                    ? a.value.secureName 
                      ? <Typography>
                          <em>{a.value.name || 'Attachment'}</em>
                          <DownloadFileIconButton secureName={a.value.secureName} onDownload={url => window.open(url, '_blank')} />
                        </Typography>
                      : null // null when optional and omitted
                  : a.type === 'signature'
                    ? <Typography>
                        {a.value.signed ? <span>Signed as <em>{a.value.fullName}</em></span> : 'Unsigned'}
                      </Typography>
                  : a.type === 'stringLong'
                    ? (
                      <Grid container direction="column">
                      {a.value.split('\n').map((line, i) => (
                        <Typography key={i}>
                          {line || <br />}    
                        </Typography>
                      ))}
                      </Grid>
                    )
                    : a.value
                  }
                </Typography>
              ) : <Typography>No value provided</Typography>
              }
              </Grid>
            )
          })}
          </>
      }
    </Grid>
  )
}